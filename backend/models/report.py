import pyodbc
from collections import OrderedDict
import random
import datetime
import copy

from utils import check_time, check_holiday, get_delta_day
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
        self.employees_list = []
        
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
        elif hour > overnight_time + 2:
            self._check_attend(date, hour)

    def _check_attend(self, date, hour):
        # attend 초기화
        
        self.previous_attend = {}
        attend = {}
        
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
                attend = self._get_initial_attend_and_employees(date=date)

        # notice and update_device        
        self._notice_email(date=date)

        # 지문 인식 출퇴근 기록
        attend = self.fingerprint_attend(attend, date)
        # 지문 인식기 + wifi 출퇴근 기록
        if USE_WIFI_ATTENDANCE:
            attend = self._fingerprint_or_wifi(attend, date)
        # Add GPS attend 
        if USE_GPS_ATTENDANCE:
            attend = self._legacy_or_gps(attend, date)
        # attend
        for employee_id in attend:
            # GPS 기록에는 regualar 여부 기록하지 않음 비상근일 때 reqular key 값이 없어 error 발생할 수 있음 
            if 'regular' not in attend:
                employee = self.employee.get(employee_id=employee_id)
                attend[employee_id]['regular'] = employee['regular']
            if employee_id in schedule_dict:
                status = schedule_dict[employee_id]
                attend[employee_id]['status'] = None
                attend[employee_id]['reason'] = status 
                # status가 2개 이상으로 표시된 경우 ex) 반차, 정기점검
                if '반차' in status: 
                    attend[employee_id]['reason'] = '반차'
                elif '휴가' in status:
                    attend[employee_id]['reason'] = '휴가'
                attend[employee_id]['workingHours'] = WORKING['status'][attend[employee_id]['reason']]
            elif attend[employee_id]['reason']:
                attend[employee_id]['status'] = None
                attend[employee_id]['workingHours'] = WORKING['status'][attend[employee_id]['reason']] 
            elif attend[employee_id]['begin']:
                # 휴일이 아닌 경우와 fulltime job인 경우만 지각 처리
                if not self.is_holiday and attend[employee_id]['regular'] in WORKING['update'] and int(attend[employee_id]['begin']) > int(WORKING['time']['beginTime']):       
                    attend[employee_id]['status'] = '지각'
                else:
                    attend[employee_id]['status'] = '정상출근'
                attend[employee_id]['workingHours'] = self._calculate_working_hours(attend[employee_id]['begin'], attend[employee_id]['end'], overnight=False)
            else:
                if hour >= 18:
                    attend[employee_id]['status'] = '미출근'
                else:
                    attend[employee_id]['status'] = '출근전'
                attend[employee_id]['workingHours'] = 0
            self._update_attend_by_employee_id(date, employee_id, attend[employee_id])

    def _get_initial_attend_and_employees(self, date=None):
        attend = {}
        if self.collection.count_documents({'date': date}):
            attend_list = self.collection.find({'date': date})
            for check_previous_attend in attend_list:
                attend[check_previous_attend['employeeId']] = check_previous_attend
        else:
            self.employees_list = self.employee.get_list(date=date)
            for employee in self.employees_list:
                name = employee['name']
                employee_id = employee['employeeId']
                regular = employee['regular']
                if employee['mode'] == '파견' and employee['attendMode'] == 'X':
                    reason = '출근'
                else:
                    reason = None
                # 같은 employee_id 인데 이름이 바뀌는 경우 발생
                attend[employee_id] = {'date': date, 'name': name, 'employeeId': employee_id, 'begin': None, 'end': None, 'reason': reason, 'regular': regular}
        self.previous_attend = copy.deepcopy(attend)
        return attend

    def fingerprint_attend(self, attend, date):
        self.overnight_employees = []
        max_uptime = 0 

        access_today = date[0:4] + date[5:7] + date[8:]  # access_day 형식으로 변환
        cursor.execute("select e_id, e_name, e_date, e_time, e_mode, e_uptime from tenter where e_date = ?", access_today)

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
                    if employee_id not in attend:
                        employee = self.employee.get(employee_id=employee_id)
                        if employee:
                            attend[employee_id] = {'date': date, 'name': name, 'employeeId': employee_id, 'begin': None, 
                                'end': None, 'reason': None, 'regular': employee['regular']}
                        else:
                            attend[employee_id] = {'date': date, 'name': name, 'employeeId': employee_id, 'begin': None, 
                                'end': None, 'reason': None, 'regular': '비상근'}
                            self.employee.post(employee_id=employee_id, name=name, begin_date=date)
                    if attend[employee_id]['begin']:
                        if int(time) < int(attend[employee_id]['begin']):
                            attend[employee_id]['begin'] = time    
                        if int(time) > int(attend[employee_id]['end']):
                            attend[employee_id]['end'] = time
                    else:
                        attend[employee_id]['begin'] = time
                        attend[employee_id]['end'] = time
                elif int(time) <= int(WORKING['time']['overNight']) and employee_id not in self.overnight_employees:
                    self.logger.info('overnight: {}, {}'.format(employee_id, time))
                    self.overnight_employees.append(employee_id)
        if max_uptime:
            self.e_uptime = max_uptime
        return attend

    def _fingerprint_or_wifi(self, attend, date):
        # wifi device
        device_dict = self.devices.by_employees(date=date)

        # wifi 와 지문 인식기 근태 비교
        for employee_id in device_dict:
            name = device_dict[employee_id][0]
            begin, end = self.device_on.get_attend_by_mac_list(device_dict[employee_id][1: ], date=date)
            if begin:
                attend = self._compare_time(attend, date, employee_id, name, begin, end)
        return attend

    def _legacy_or_gps(self, attend, date):
        # GPS device
        gps_on_list = self.gps_on.get_attend(date=date)

        # gps 와 legacy 근태 비교
        for gps_on in gps_on_list:
            attend = self._compare_time(attend, date, gps_on['employeeId'], gps_on['name'], gps_on['begin'], gps_on['end'])
        return attend

    def _update_attend_by_employee_id(self, date, employee_id, attend_by_employee_id):
        try:
            # fulltime이 아닌 직원에 대해 미출근과 출근전인 경우 기록하지 않음
            # 주말인 경우 employee 정보 수집을 하지 않기 때문에 regular key가 없을 수 있음
            # employee 등록이 안 된 경우 regular key가 없을 수 있음
            if attend_by_employee_id['regular'] not in WORKING['update'] and attend_by_employee_id['status'] not in ['정상출근']:
                pass
            else:
                if employee_id in self.previous_attend and self.previous_attend[employee_id] == attend_by_employee_id:
                    pass
                else:
                    self.collection.update_one({'date': date, 'employeeId': employee_id}, {'$set': attend_by_employee_id}, upsert=True)
        except Exception as e:
            self.logger.error('{}, {}'.format(e, attend_by_employee_id))

    def _compare_time(self, attend, date, employee_id, name, begin, end):
        if employee_id in attend:
            if attend[employee_id]['begin']:
                if int(begin) < int(attend[employee_id]['begin']):
                    attend[employee_id]['begin'] = begin
            else:
                attend[employee_id]['begin'] = begin
            if attend[employee_id]['end']:
                if int(end) > int(attend[employee_id]['end']):
                    attend[employee_id]['end'] = end
            else:
                attend[employee_id]['end'] = end
        else:
            attend[employee_id] = {'date': date, 'employee_id': employee_id, 'name':name, 'begin': begin, 'end': end, 'reason': None}
        return attend 

    def _calculate_working_hours(self, begin, end, overnight=False):
        working_hours = (int(end[0:2]) - int(begin[0:2])) + \
                        (int(end[2:4]) - int(begin[2:4])) / 60
        if overnight:
            working_hours = working_hours + 24
            if int(WORKING['time']['lunchTime']) > int(begin):
                working_hours = working_hours - 1
        else:
            if int(end) > int(WORKING['time']['lunchFinishTime']) and \
                    int(WORKING['time']['lunchTime']) > int(begin):
                working_hours = working_hours - 1
        working_hours = round(working_hours, 1)
        return working_hours

    def _update_overnight(self, date=None):
        self.logger.info('overnight: {}'.format(self.overnight_employees))
        yesterday = get_delta_day(date, delta=-1)
        access_yesterday = yesterday[0:4] + yesterday[5:7] + yesterday[8:]
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
                self.logger.info('attendyesterday: {}'.format(attend))
                access_today = date[0:4] + date[5:7] + date[8:]
                cursor.execute(
                    "select e_id, e_name, e_date, e_time, e_mode from tenter where e_date = ? and e_id = ?",
                    (access_today, employee_id))
                end = '000000'
                for row in cursor.fetchall():
                    time = row[3]
                    if int(time) < int(WORKING['time']['overNight']):
                        if end < time:
                            end = time
                attend['end'] = end
                attend['workingHours'] = self._calculate_working_hours(attend['begin'], end, overnight=True)
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
            notice = collection.find_one({'date': date})
            if notice is None:
                for employee in self.employees_list:
                    insert_data = self._send_notice_email(employee=employee)
                    if insert_data:
                        collection.insert_one(insert_data)

    def _send_notice_email(self, employee={}, email=None):
        '''
            1. email이 있고 regular 여부가 WORKING['update']에 포함되어 있는 경우만 메일 송부 
        '''
        name = employee['name']
        employee_id = employee['employeeId']
        if 'email' in employee:
            email = employee['email']

        if email and employee['regular'] in WORKING['update']:
            report = self.collection.find_one({'employeeId': employee_id, 'date': {"$lt": self.today}}, sort=[('date', -1)])
            if report:
                begin = self._convert_begin(report['begin'])
                status = report['status']
                if status in EMAIL_NOTICE_BASE:
                    self.logger.info('send_notice_email, {}, {}'.format(self.today, name))
                    # https://techexpert.tips/ko/python-ko/파이썬-office-365를-사용하여-이메일-보내기
                    # https://nowonbun.tistory.com/684 (참조자)
                    body = '\n' \
                        ' 안녕하세요 %s님 \n' \
                        '근태 관련하여 다음의 사유가 있어 메일을 송부합니다. \n ' \
                        '\n' \
                        '- 이름: %s \n' \
                        '- 날짜: %s \n' \
                        '- 출근 시각: %s \n' \
                        '- 근무 시간: %s \n' \
                        '- 사유: %s \n' \
                        '\n' \
                        '연차, 외근 등의 사유가 있는 경우 %s 를 통해 출근 품의를 진행하면 근태가 정정이 됩니다. ' \
                        %(name, name, report['date'], begin, report['workingHours'], str(status), SITE_URL + 'schedule')

                    subject = '[근태 관리] ' + report_date + ' ' + name + ' ' + str(status)
                    sent = send_email(email=email, subject=subject, body=body, include_cc=True)
                    if sent:
                        return {'date': self.today, 'name': name, 'email': email, 'reportDate': report_date, 'status': status}
                    else:
                        return sent
                else:
                    return False

    def _schedule(self, date=None):
        collection = db['events']
        schedule_dict = {}
        data_list = collection.find({'start': {"$lte": date}, 'end': {"$gt": date}})
        for data in data_list:
            title = data['title']
            if title in WORKING['specialHolidays']:
                schedule_dict = {'holiday': title}
                break

            if 'employeeId' in data:
                employee_id = data['employeeId']
                status = self._get_status_from_schedule(title)
                
                # 반차가 포함된 경우에만 status 추가 가능 
                if employee_id in schedule_dict and schedule_dict[employee_id] != '휴가' and status !='휴가' and (schedule_dict[employee_id] == '반차' or status == '반차'):
                    schedule_dict[employee_id] = schedule_dict[employee_id] + ', ' + status
                elif employee_id in schedule_dict and status == '휴가':
                    schedule_dict[employee_id] = status 
                else:
                    schedule_dict[employee_id] = status
        return schedule_dict
    
    def _convert_begin(self, begin=None):
        if begin:
            begin = begin[0:2] + ':' + begin[2:4] + ':' + begin[4:6]
        return begin 

    def _get_status_from_schedule(self, title):
        status = '기타'     
        for status_type in WORKING['status']:
            if status_type in title:
                status = status_type
        return status 



  