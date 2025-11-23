import pyodbc
from collections import OrderedDict
import random
import datetime
import copy

from utils import check_time, check_holiday, get_delta_day, get_access_day, calculate_working_hours, render_notice_html
from .db import db, BasicModel
from .mail import send_email
from .employee import Employee
from .deviceon import DeviceOn
from .gpson import GPSOn
from .device import Device
try:
    from mainconfig import ACCESS_DB_PWD, SITE_URL
except Exception as e:
    from testconfig import ACCESS_DB_PWD, SITE_URL
from config import USE_WIFI_ATTENDANCE, USE_GPS_ATTENDANCE, USE_NOTICE_EMAIL, EMAIL_NOTICE_BASE, WORKING

# connect to access db
# https://stackoverflow.com/questions/50757873/connect-to-ms-access-in-python
# You probably have 32-bit Access (Office) and 64-bit Python. As you know, 32-bit and 64-bit are completely incompatible.
# You need to install 32-bit Python, or upgrade Access (Office) to 64-bit
conn = pyodbc.connect(r'Driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=c:/caps/acserver/access.mdb;PWD=%s' %ACCESS_DB_PWD)
cursor = conn.cursor()


class Report(BasicModel):
    def __init__(self):
        super().__init__(model='reports')
        self.logger.info('Start')
        self.employee = Employee()
        if USE_WIFI_ATTENDANCE:
            self.devices = Device()
            self.device_on = DeviceOn()
        self.gps_on = GPSOn()
        
        self.e_uptime = 0
        self.employee_list = []
        
    def update(self, date=None):
        '''
            1. device 정보 update (오늘 날짜인 경우만 update)
            2. 평일인 경우 이전 출근 기록에 지각, 미출근 등에 대해서 통지 메일 송부 (오늘 날짜인 경우만 update)
            3. 지문 인식기 근태 기록 확인
            4. wifi 근태 기록 확인
            5. overnight 근무가 확인 되는 경우 이전 날짜 근태 기록 update
        '''
        hour, self.today, _ = check_time()
        if date and date != self.today:
            hour = 23
        else:
            date = self.today
        overnight_time = int(WORKING['time']['overNight'][:2])

        if hour > overnight_time - 1 and hour <= overnight_time:
            yesterday = get_delta_day(date, delta=-1)
            self._check_attend(yesterday, 23)
            '''
                 1. overnight 근무자에 대해서 이전 날짜 update
            '''
            if self.overnight_employees:
                self._update_overnight(date=yesterday)
        elif (hour > overnight_time and hour <= overnight_time + 1) or (date != self.today):
            self._check_attend(date, hour)
            '''
                 1. overnight 근무자에 대해서 이전 날짜 update
            '''
            if self.overnight_employees:
                self._update_overnight(date=date)
        elif hour > overnight_time + 2 and hour <= overnight_time + 3:
            self._check_attend(date, hour)
            # notice  
            try:
                self._notice_email(date=date)
            except Exception as e:
                self.logger.error(f'{e}, {date}', exc_info=True)
        elif hour > overnight_time + 3:
            self._check_attend(date, hour)

    def _check_attend(self, date, hour):
        # attend 초기화
        self.previous_attends = {}
        attends = {}
        
        # holidady 여부 확인 
        self.is_holiday = check_holiday(date)
        if self.is_holiday:
            schedule_dict = {}
            self.e_uptime = 0
        else:
            schedule_dict = self._schedule(date=date)
            # special holiday가 있는 경우 제외
            if 'holiday' in schedule_dict:
                self.is_holiday = True
                self.e_uptime = 0
            else:
                attends = self._get_initial_attends(date=date)

        # 지문 인식 출퇴근 기록
        attends = self.fingerprint_attend(attends, date)
        # 지문 인식기 + wifi 출퇴근 기록
        if USE_WIFI_ATTENDANCE:
            attends = self._fingerprint_or_wifi(attends, date)
        # Add GPS attend 
        if USE_GPS_ATTENDANCE:
            attends = self._legacy_or_gps(attends, date)
        # attends
        for employee_id in attends:
            # GPS 기록에는 regualar 여부 기록하지 않음 비상근일 때 reqular key 값이 없어 error 발생할 수 있음 
            employee_attendance = attends[employee_id]
            if 'regular' not in employee_attendance:
                employee = self.employee.get(employee_id=employee_id)
                employee_attendance['regular'] = employee['regular']
            if employee_id in schedule_dict:
                reason = schedule_dict[employee_id]
                employee_attendance['status'] = None
                employee_attendance['reason'] = reason 
                # reason이 2개 이상으로 표시된 경우 ex) 반차, 정기점검
                if '반차' in reason: 
                    employee_attendance['reason'] = '반차'
                elif '휴가' in reason:
                    employee_attendance['reason'] = '휴가'
                employee_attendance['workingHours'] = WORKING['reason'][employee_attendance['reason']]
            elif employee_attendance['reason']:
                employee_attendance['status'] = None
                employee_attendance['workingHours'] = WORKING['reason'][employee_attendance['reason']] 
            elif employee_attendance['begin']:
                # 휴일이 아닌 경우와 fulltime job인 경우만 지각 처리
                if not self.is_holiday and employee_attendance['regular'] in WORKING['update'] and int(employee_attendance['begin']) > int(WORKING['time']['beginTime']):       
                    employee_attendance['status'] = '지각'
                else:
                    employee_attendance['status'] = '정상출근'
                employee_attendance['workingHours'] = calculate_working_hours(employee_attendance['begin'], employee_attendance['end'], overnight=False)
            else:
                if hour >= 18:
                    employee_attendance['status'] = '미출근'
                else:
                    employee_attendance['status'] = '출근전'
                employee_attendance['workingHours'] = 0
            self._update_employee_attendance(date, employee_id, employee_attendance)

    def _get_initial_attends(self, date=None):
        if self.collection.count_documents({'date': date}):
            attend_list = self.collection.find({'date': date})
            attends = {check_previous_attend['employeeId']: check_previous_attend for check_previous_attend in attend_list}
        else:
            attends = {}
            self.employee_list = self.employee.get_list(date=date)
            for employee in self.employee_list:
                name = employee['name']
                employee_id = employee['employeeId']
                regular = employee['regular']
                if employee['mode'] == '파견' and employee['attendMode'] == 'X':
                    reason = '출근'
                else:
                    reason = None
                # 같은 employee_id 인데 이름이 바뀌는 경우 발생해서 name 표기 
                employee_attendance = {'date': date, 'name': name, 'employeeId': employee_id, 'begin': None, 'end': None, 'reason': reason, 'regular': regular}
                attends[employee_id] = employee_attendance
        self.previous_attends = copy.deepcopy(attends)
        return attends

    def fingerprint_attend(self, attends, date):
        self.overnight_employees = []
        max_uptime = 0 

        access_today = get_access_day(date, delta=0)  # access_day 형식으로 변환
        cursor.execute('select e_id, e_name, e_date, e_time, e_mode, e_uptime from tenter where e_date = ?', access_today)

        for row in cursor.fetchall():
            employee_id = int(row[0])
            name = row[1]
            time = row[3]   # time은 str type 
            e_uptime= int(row[5])
            # card 출근자 name = ''
            if name:
                if e_uptime > self.e_uptime and int(time) > int(WORKING['time']['overNight']): # overnight가 아닌 것에 대한 기준
                    if e_uptime > max_uptime:
                        max_uptime = e_uptime
                    if employee_id in attends:
                        employee_attendance = attends[employee_id]
                    else:
                        employee = self.employee.get(employee_id=employee_id)
                        employee_attendance = {'date': date, 'name': name, 'employeeId': employee_id, 'begin': None, 'end': None, 'reason': None}
                        if employee:
                            employee_attendance['reqular'] = employee['regular']
                        else:
                            employee_attendance['regular'] = '비상근'
                            self.employee.post(employee_id=employee_id, name=name, begin_date=date)
                        attends[employee_id] = employee_attendance
                    if employee_attendance['begin']:
                        if int(time) < int(employee_attendance['begin']):
                            employee_attendance['begin'] = time    
                        if int(time) > int(employee_attendance['end']):
                            employee_attendance['end'] = time
                    else:
                        employee_attendance['begin'] = time
                        employee_attendance['end'] = time
                elif int(time) <= int(WORKING['time']['overNight']) and employee_id not in self.overnight_employees:
                    self.logger.info(f'overnight: {employee_id}, {time}')
                    self.overnight_employees.append(employee_id)
        if max_uptime:
            self.e_uptime = max_uptime
        return attends

    def _fingerprint_or_wifi(self, attends, date):
        # wifi device
        device_dict = self.devices.by_employees(date=date)

        # wifi 와 지문 인식기 근태 비교
        for employee_id in device_dict:
            name = device_dict[employee_id][0]
            begin, end = self.device_on.get_attend_by_mac_list(device_dict[employee_id][1: ], date=date)
            if begin:
                if employee_id in attends:
                    employee_attendance = attends[employee_id]
                    employee_attendance = self._compare_time(employee_attendance, begin, end)
                else:
                    employee_attendance = {'date': date, 'employeeId': employee_id, 'name': name, 'begin': begin, 'end': end, 'reason': None}
                attends[employee_id] = employee_attendance
        return attends

    def _legacy_or_gps(self, attends, date):
        # GPS device
        gps_on_list = self.gps_on.get_attend(date=date)

        # gps 와 legacy 근태 비교
        for gps_on in gps_on_list:
            employee_id = gps_on['employeeId']
            begin = gps_on['begin']
            end = gps_on['end']
            if employee_id in attends:
                employee_attendance = attends[employee_id]
                employee_attendance = self._compare_time(employee_attendance, begin, end)
            else:
                employee_attendance = {'date': date, 'employeeId': employee_id, 'name': gps_on['name'], 'begin': begin, 'end': end, 'reason': None}
            attends[employee_id] = employee_attendance
        return attends

    def _update_employee_attendance(self, date, employee_id, employee_attendance):
        try:
            # fulltime이 아닌 직원에 대해 미출근과 출근전인 경우 기록하지 않음
            # 주말인 경우 employee 정보 수집을 하지 않기 때문에 regular key가 없을 수 있음
            # employee 등록이 안 된 경우 regular key가 없을 수 있음
            if employee_attendance['regular'] not in WORKING['update'] and employee_attendance['status'] in EMAIL_NOTICE_BASE:
                pass
            else:
                if employee_id in self.previous_attends and self.previous_attends[employee_id] == employee_attendance:
                    pass
                else:
                    self.collection.update_one({'date': date, 'employeeId': employee_id}, {'$set': employee_attendance}, upsert=True)
        except Exception as e:
            self.logger.error(f'{e}, {employee_attendance}', exc_info=True)

    def _compare_time(self, employee_attendance, begin, end):
        if employee_attendance['begin']:
            if int(begin) < int(employee_attendance['begin']):
                employee_attendance['begin'] = begin
        else:
            employee_attendance['begin'] = begin
        if employee_attendance['end']:
            if int(end) > int(employee_attendance['end']):
                employee_attendance['end'] = end
        else:
            employee_attendance['end'] = end
        return employee_attendance

    def _update_overnight(self, date=None):
        self.logger.info(f'overnight: {self.overnight_employees}')
        access_yesterday = get_access_day(date, delta=-1)
        yesterday = get_delta_day(date, delta=-1)
        for employee_id in self.overnight_employees:
            cursor.execute("select e_id, e_name, e_date, e_time, e_mode from tenter where e_date=? and e_id = ?",
                           (access_yesterday, employee_id))
            attend = {'date': yesterday, 'employeeId': int(employee_id)}
            for row in cursor.fetchall():
                time = row[3]
                mode = int(row[4])
                if int(time) > int(WORKING['time']['overNight']) or mode != 2:
                    if 'begin' in attend:
                        if int(time) < int(attend['begin']):
                            attend['begin'] = time
                        if int(time) > int(attend['end']):
                            attend['end'] = time
                    else:
                        attend['begin'] = time
                        attend['end'] = time

            if 'begin' in attend:
                self.logger.info(f'attendyesterday: {attend}')
                access_today = get_access_day(date)
                cursor.execute(
                    'select e_id, e_name, e_date, e_time, e_mode from tenter where e_date = ? and e_id = ?',
                    (access_today, employee_id))
                end = '000000'
                for row in cursor.fetchall():
                    time = row[3]
                    if int(time) < int(WORKING['time']['overNight']):
                        if end < time:
                            end = time
                attend['end'] = end
                attend['workingHours'] = calculate_working_hours(attend['begin'], end, overnight=True)
                self.collection.update_one({'date': attend['date'], 'employeeId': int(employee_id)}, {'$set': attend}, upsert=True)

    def _notice_email(self, date=None):
        '''
            1. update 날짜가 오늘 날짜인 경우와 휴일이 아닌 경우 진행
            2. USE_NOTICE_EMAIL 설정이 True일 경우
            3. 오늘 notice한 이력이 있는지 확인 후
            4. EMAIL_NOTICE_BASE 일 경우 email 전송
        '''
        if not self.is_holiday and date == self.today and USE_NOTICE_EMAIL:
            collection = db['notice']

            notice_count = collection.count_documents({'date': date})    
            if not notice_count:
                for employee in self.employee_list:
                    insert_data = self._send_notice_email(employee=employee)
                    if insert_data:
                        collection.insert_one(insert_data)

    def _send_notice_email(self, employee={}):
        '''
            1. email이 있고 regular 여부가 WORKING['update']에 포함되어 있는 경우만 메일 송부 
        '''
        if not employee:
            return False

        name = employee.get('name')
        employee_id = employee.get('employeeId')
        email = employee.get('email', None)

        if not email or employee.get('regular') not in WORKING['update']:
            return False

        try:
            report = self.collection.find_one({'employeeId': employee_id, 'date': {'$lt': self.today}}, sort=[('date', -1)])
            if not report:
                return False

            status = report.get('status')
            if status not in EMAIL_NOTICE_BASE:
                return False

            self.logger.info(f'[NOTICE EMAIL] {self.today} {name}')
            subject = f"[근태 관리] {report['date']} {name} {status}"
            html_body = render_notice_html(name, report)
            cc = self.employee.get_approver(employee)['email']
            sent = send_email(email=email, subject=subject, body=html_body, cc=cc,include_cc=True)     
            if sent:
                return {'date': self.today, 'name': name, 'email': email, 'reportDate': report['date'], 'status': status}
            else:
                return sent
        except Exception as e:
            self.logger.error(f'메일 발송 중 오류 발생: {e}', exc_info=True)
            return False

    def _schedule(self, date=None):
        collection = db['events']
        schedule_dict = {}
        data_list = collection.find({'start': {'$lte': date}, 'end': {'$gt': date}})
        for data in data_list:
            title = data['title']
            if title in WORKING['specialHolidays']:
                schedule_dict = {'holiday': title}
                break

            if 'employeeId' in data:
                employee_id = data['employeeId']
                reason = self._get_reason_from_event(title)
                
                # 반차가 포함된 경우에만 reason 추가 가능 
                if employee_id in schedule_dict and schedule_dict[employee_id] != '휴가' and reason != '휴가' and (schedule_dict[employee_id] == '반차' or reason == '반차'):
                    schedule_dict[employee_id] = f'{schedule_dict[employee_id]}, {reason}'
                elif employee_id in schedule_dict and reason == '휴가':
                    schedule_dict[employee_id] = reason 
                else:
                    schedule_dict[employee_id] = reason
        return schedule_dict

    def _get_reason_from_event(self, title):
        reason = '기타'     
        for reason_type in WORKING['reason']:
            # if reason_type in title: 포함된 값이 아닌 select로 값을 받기 때문에 == 으로 변경
            if reason_type == title.split('/')[1]:
                if reason_type in WORKING['outStatus']['반차']:
                    reason = '반차'
                else:
                    reason = reason_type
        return reason




  