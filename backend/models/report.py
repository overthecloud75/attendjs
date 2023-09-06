import pyodbc
from collections import OrderedDict
import random
import datetime

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
        self.employee = Employee()
        self.devices = Device()
        self.device_on = DeviceOn()
        self.gps_on = GPSOn()

    def update(self, date=None):
        '''
            1. device 정보 update (오늘 날짜인 경우만 update)
            2. 평일인 경우 이전 출근 기록에 지각, 미출근 등에 대해서 통지 메일 송부 (오늘 날짜인 경우만 update)
            3. 지문 인식기 근태 기록 확인
            4. wifi 근태 기록 확인
            5. overnight 근무가 확인 되는 경우 이전 날짜 근태 기록 update
        '''
        hour, today, _ = check_time()

        self.today = today 
        if date:
            if date != today:
                hour = 23
        else:
            date = today
        overNight_time = int(WORKING['time']['overNight'][:2])

        if hour > overNight_time - 1 and hour <= overNight_time:
            yesterday = get_delta_day(date, delta=-1)
            overnight_employees = self._check_attend(yesterday, 23)
            '''
                 1. overnight 근무자에 대해서 이전 날짜 update
            '''
            if overnight_employees:
                self._update_overnight(overnight_employees, date=yesterday)

        elif hour > overNight_time and hour <= overNight_time + 1:
            overnight_employees = self._check_attend(date, hour)
            '''
                 1. overnight 근무자에 대해서 이전 날짜 update
            '''
            if overnight_employees:
                self._update_overnight(overnight_employees, date=date)

        elif hour > overNight_time + 2:
            self._check_attend(date, hour)

    def _check_attend(self, date, hour):
        print('update', datetime.datetime.now())
        # attend 초기화
        attend = {}
        schedule_dict = {}

        is_holiday = check_holiday(date)

        if not is_holiday:
            employees_list = self.employee.get(date=date)
            schedule_dict = self._schedule(employees_list, date=date)
            # special holiday가 있는 경우 제외
            if 'holiday' not in schedule_dict:
                for employee in employees_list:
                    name = employee['name']
                    employee_id = employee['employeeId']
                    regular = employee['regular']
                    if employee['mode'] in WORKING['status'] and employee['attendMode'] == 'X':
                        reason = employee['mode']
                    else:
                        reason = None
                    # 같은 employee_id 인데 이름이 바뀌는 경우 발생
                    attend[employee_id] = {'date': date, 'name': name, 'employeeId': employee_id, 'begin': None, 'end': None, 'reason': reason, 'regular': regular}
                # update 날짜가 오늘 날짜인 경우만 진행
                if date == self.today:
                    # self._update_devices(date=date)
                    self._notice_email(employees_list=employees_list)
            else:
                is_holiday = True
        
        if date == self.today:
            self._update_devices(date=date)

        # 지문 인식 출퇴근 기록
        attend, overnight_employees = self.fingerprint_attend(attend, date, hour)
        # 지문 인식기 + wifi 출퇴근 기록
        if USE_WIFI_ATTENDANCE:
            attend = self._fingerprint_or_wifi(attend, date)
        # Add GPS attend 
            attend = self._legacy_or_gps(attend, date)
        
        # attend
        for employee_id in attend:
            name = attend[employee_id]['name']
            if name in schedule_dict:
                status = schedule_dict[name]
                attend[employee_id]['status'] = None
                attend[employee_id]['reason'] = status
                if hour >= 18:
                    # status가 2개 이상으로 표시된 경우 ex) 반차, 정기점검
                    if '반차' in status: 
                        status = '반차'
                        attend[employee_id]['reason'] = status
                    elif '휴가' in status:
                        status = '휴가'
                        attend[employee_id]['reason'] = status
                    attend[employee_id]['workingHours'] = WORKING['status'][status]
                else:
                    attend[employee_id]['workingHours'] = None
            elif attend[employee_id]['reason']:
                attend[employee_id]['status'] = None
                if hour >= 18:
                    attend[employee_id]['workingHours'] = WORKING['status'][attend[employee_id]['reason']]
                else:
                    attend[employee_id]['workingHours'] = None # 파견인 경우 18시 전에 workingHours에 대한 내용이 없어서 추가
            elif attend[employee_id]['begin']:
                if not is_holiday:
                    if 'regular' in attend[employee_id] and attend[employee_id]['regular'] in WORKING['update'] and \
                            int(attend[employee_id]['begin']) > int(WORKING['time']['beginTime']):
                        # fulltime job만 지각 처리
                        attend[employee_id]['status'] = '지각'
                    else:
                        attend[employee_id]['status'] = '정상출근'
                else:
                    attend[employee_id]['status'] = '정상출근'
                if hour >= 18:
                    attend[employee_id]['workingHours'] = self._calculate_working_hours(attend[employee_id]['begin'], attend[employee_id]['end'], overnight=False)
                else:
                    attend[employee_id]['workingHours'] = None
            else:
                if not is_holiday:
                    if hour >= 18:
                        attend[employee_id]['workingHours'] = 0
                        attend[employee_id]['status'] = '미출근'
                    elif hour >= int(WORKING['time']['beginTime']) / 10000:
                        attend[employee_id]['workingHours'] = None
                        attend[employee_id]['status'] = '지각'
                    else:
                        attend[employee_id]['workingHours'] = None
                        attend[employee_id]['status'] = '출근전'
                else:
                    attend[employee_id]['status'] = '정상출근'

            try:
                if 'regular' in attend[employee_id] and attend[employee_id]['regular'] not in WORKING['update'] and \
                        attend[employee_id]['status'] not in ['정상출근'] :
                    # fulltime이 아닌 직원에 대해 미출근과 출근전인 경우 기록하지 않음
                    # 주말인 경우 employee 정보 수집을 하지 않기 때문에 regular key가 없을 수 있음
                    # employee 등록이 안 된 경우 regular key가 없을 수 있음
                    pass
                else:
                    self.collection.update_one({'date': date, 'employeeId': employee_id}, {'$set': attend[employee_id]}, upsert=True)
            except Exception as e:
                print('error', e)
                print(attend[employee_id])

        return overnight_employees

    def fingerprint_attend(self, attend, date, hour):
        overnight_employees = []

        access_today = date[0:4] + date[5:7] + date[8:]  # access_day 형식으로 변환
        cursor.execute("select e_id, e_name, e_date, e_time, e_mode from tenter where e_date = ?", access_today)

        for row in cursor.fetchall():
            employee_id = int(row[0])
            name = row[1]
            time = row[3]
            # mode = int(row[4])
            # card 출근자 name = ''
            if name != '':
                if int(time) > int(WORKING['time']['overNight']):  # overnight가 아닌 것에 대한 기준
                    if employee_id not in attend:
                        attend[employee_id] = {'date': date, 'name': name, 'employeeId': employee_id, 'begin': None,
                                        'end': None, 'reason': None}
                        
                        # employee_id가 있는데 attend에 없는 경우는 신입 사원 => 등록 
                        self.employee.post(employee_id=employee_id, name=name, begin_date=date )
                    if attend[employee_id]['begin']:
                        if int(time) < int(attend[employee_id]['begin']):
                            attend[employee_id]['begin'] = time
                        if hour >= 18:
                            attend[employee_id]['end'] = time
                    else:
                        attend[employee_id]['begin'] = time
                        if hour >= 18:
                            attend[employee_id]['end'] = time
                        else:
                            attend[employee_id]['end'] = None
                else:
                    print('overnight', employee_id, time)
                    if employee_id not in overnight_employees:
                        overnight_employees.append(employee_id)
        return attend, overnight_employees

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

    def _update_overnight(self, overnight_employees, date=None):
        print('overnight', overnight_employees)
        if date is None:
            date = self.today
        yesterday = get_delta_day(date, delta=-1)

        access_yesterday = yesterday[0:4] + yesterday[5:7] + yesterday[8:]
        for employee_id in overnight_employees:
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
                print('attendyesterday', attend)
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
                self.collection.update_one({'date': attend['date'], 'employeeId': int(employee_id)}, {'$set': attend},
                                           upsert=True)

    def _notice_email(self, employees_list=[]):
        '''
            1. USE_NOTICE_EMAIL 설정이 True일 경우
            2. 오늘 notice한 이력이 있는지 확인 후
            3. EMAIL_NOTICE_BASE 일 경우 email 전송
        '''
        if USE_NOTICE_EMAIL:
            collection = db['notice']
            notice = collection.find_one({'date': self.today})
            if notice is None:
                for employee in employees_list:
                    if employee['email']:
                        insert_data = self._send_notice_email(employee=employee)
                        if insert_data:
                            collection.insert_one(insert_data)

    def _send_notice_email(self, employee):
        name = employee['name']
        employee_id = employee['employeeId']
        email = employee['email']
        regular = employee['regular']

        report = self.collection.find_one({'name': name, 'employeeId': employee_id, 'date': {"$lt": self.today}}, sort=[('date', -1)])
        if report:
            report_date = report['date']
            begin = report['begin']
            if begin:
                begin = begin[0:2] + ':' + begin[2:4] + ':' + begin[4:6]
            status = report['status']
            working_hours = report['workingHours']
            if status in EMAIL_NOTICE_BASE and regular in WORKING['update']:
                print('send_notice_email', self.today, name)
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
                    '연차, 외근 등의 사유가 있는 경우 %s 에 기록을 하시면 근태가 정정이 됩니다. ' \
                    %(name, name, report_date, begin, working_hours, str(status), SITE_URL + 'schedule')

                subject = '[근태 관리] ' + report_date + ' ' + name + ' ' + str(status)
                sent = send_email(email=email, subject=subject, body=body, include_cc=True)
                if sent:
                    return {'date': self.today, 'name': name, 'email': email, 'reportDate': report_date, 'status': status}
                else:
                    return sent
            else:
                return False

    def _update_devices(self, date=None):
        mac_list = self.device_on.get_device_list(date=date)
        for device in mac_list:
            request_data = {'mac': device['mac'], 'ip': device['ip'], 'endDate': date}
            self.devices.post(request_data)

    def _schedule(self, employees_list, date=None):
        collection = db['events']
        schedule_dict = {}
        data_list = collection.find({'start': {"$lte": date}, 'end': {"$gt": date}})
        for data in data_list:
            if data['title'] in WORKING['specialHolidays']:
                schedule_dict = {'holiday': data['title']}
                break
            name = None
            status = '기타'
            for employee in employees_list:
                if employee['name'] in data['title']:
                    name = employee['name']      
            for status_type in WORKING['status']:
                if status_type in data['title']:
                    status = status_type
            if name:
                # 반차가 포함된 경우에만 status 추가 가능 
                if name in schedule_dict and schedule_dict[name] != '휴가' and status !='휴가' and (schedule_dict[name] == '반차' or status == '반차'):
                    schedule_dict[name] = schedule_dict[name] + ', ' + status_type
                elif name in schedule_dict and status == '휴가':
                    schedule_diect[name] = status 
                else:
                    schedule_dict[name] = status
        return schedule_dict
  