import os
import subprocess
import locale
import nmap
import datetime
from datetime import timedelta
from korean_lunar_calendar import KoreanLunarCalendar
import asyncio

from config import WORKING, USE_LUNAR_NEW_YEAR
try:
    from mainconfig import WIFI, SCAN_RANGE_LIST
except Exception as e:
    from testconfig import WIFI, SCAN_RANGE_LIST

class Scanner:
    def __init__(self):
        self.nm = nmap.PortScanner()

    def nmap_sn_scan(self):
        network_list = []
        date, time = check_hour()
        for ip_range in SCAN_RANGE_LIST:
            result = self.nm.scan(ip_range, arguments='-sn')
            if result['scan']:
                for ip in result['scan']:
                    if 'mac' in result['scan'][ip]['addresses']:
                        mac = result['scan'][ip]['addresses']['mac']
                        ipv4 = result['scan'][ip]['addresses']['ipv4']
                        # ip 정렬 문제로 ip_str 필요
                        ip_str = self.make_ip_str(ip)
                        # nmap으로 하는 경우 mac 값이 대문자로 표시가 됨 -> 소문자로 변경 필요
                        network = {'mac': mac.lower(), 'ip': ipv4, 'date': date, 'time': time, 'ipStr': ip_str}
                        if mac in result['scan'][ip]['vendor']:
                            network['vendor'] = result['scan'][ip]['vendor'][mac]
                        else:
                            network['vendor'] = ''
                        network_list.append(network)
        return network_list

    def nmap_o_scan(self):
        network_list = []
        for ip_range in SCAN_RANGE_LIST:
            result = self.nm.scan(ip_range, arguments='-O')
            if result['scan']:
                for ip in result['scan']:
                    network = {}
                    if 'mac' in result['scan'][ip]['addresses']:
                        mac = result['scan'][ip]['addresses']['mac']
                        network['mac'] = mac.lower()
                        network['os'] = ''
                        network['accuracy'] = ''
                        if result['scan'][ip]['osmatch']:
                            network['os'] = result['scan'][ip]['osmatch'][0]['name']
                            network['accuracy'] = result['scan'][ip]['osmatch'][0]['accuracy'] 
                        network_list.append(network)
        return network_list

    def check_wifi_connected(self):
        os_encoding = locale.getpreferredencoding()
        cmd = 'netsh interface show interface'
        cmd = cmd.split()
        fd_popen = subprocess.Popen(cmd, stdout=subprocess.PIPE).stdout
        data_list = fd_popen.read().decode(os_encoding).strip().split()
        fd_popen.close()

        status_list = []
        interface_list = []
        for data in data_list:
            if '연결' in data or 'connected' in data.lower():
                status_list.append(data.lower())
            if '이더넷' in data or 'ethernet' in data.lower() or 'wi-fi' in data.lower():
                interface_list.append(data.lower())

        connected = False
        for status, interface in zip(status_list, interface_list):
            if interface == 'wi-fi':
                if status == '연결됨' or status == 'connected':
                    connected = True

        return connected

    def connect_wifi(self):
        os.system(f'''cmd /c "netsh wlan connect name={WIFI['NAME_OF_ROUTER']}"''')

    def make_ip_str(self, ip):
        ip_split_list = ip.split('.')
        ip_str = ''
        for ip_split in ip_split_list:
            ip_part = ip_split
            if len(ip_split) == 2:
                ip_part = '0' + ip_split
            elif len(ip_split) == 1:
                ip_part = '00' + ip_split

            if ip_str == '':
                ip_str = ip_part
            else:
                ip_str = ip_str + '.' + ip_part
        return ip_str

class SMTPServer:
    '''async def handle_RCPT(self, server, session, envelope, address, rcpt_options):
        print('handle_RCPT')
        print('address', address)
        print('Message from %s' % envelope.mail_from)
        print('Message for %s' % envelope.rcpt_tos)
        #if not address.endswith('@example.com'):
        #    return '550 not relaying to that domain'
        envelope.rcpt_tos.append(address)
        return '250 OK'
    '''

    async def handle_DATA(self, server, session, envelope):
        print('handle_DATA')
        print('Message from %s' % envelope.mail_from)
        print('Message for %s' % envelope.rcpt_tos)
        #for ln in envelope.content.decode('utf8', errors='replace').splitlines():
        #    print(f'> {ln}'.strip())
        #    print()
        print('End of message')
        return '250 OK'

def check_holiday(date):
    is_holiday = False
    year = date[0:4]
    month = date[5:7]
    day = date[8:]
    month_day = month + day

    date = datetime.datetime(int(year), int(month), int(day), 1, 0, 0)  # str -> datetime으로 변환

    lunar_calendar = KoreanLunarCalendar()
    lunar_calendar.setSolarDate(int(year), int(month), int(day))
    lunar_month_day = lunar_calendar.LunarIsoFormat()
    lunar_month_day = lunar_month_day[5:7] + lunar_month_day[8:]

    if month_day in WORKING['holidays'] or lunar_month_day in WORKING['lunarHolidays']:
        is_holiday = True
    elif date.weekday() == 5 or date.weekday() == 6:
        is_holiday = True
    elif date.weekday() == 0:
        # 대체공휴일 적용
        yesterday = date - timedelta(days=1)
        yesterday = datetimeToDate(yesterday)
        two_days_ago = date - timedelta(days=2)
        two_days_ago = datetimeToDate(two_days_ago)
        if yesterday in WORKING['alternativeVacation'] or two_days_ago in WORKING['alternativeVacation']:
            is_holiday = True

    if USE_LUNAR_NEW_YEAR:
        if not is_holiday and int(month) < 4:
            # 음력 1월 1일 전날의 날짜를 특정하기 어려워서 아래의 logic을 사용
            # 12월 29일수도 있고 12월 30일일 수도 있음 윤달이 있으면 단순히 처리하기 쉽지 않음
            tomorrow = date + timedelta(days=1)
            tomorrow = datetimeToDate(tomorrow)
            lunar_calendar.setSolarDate(int(year), int(tomorrow[0:2]), int(tomorrow[2:4]))
            lunar_month_day = lunar_calendar.LunarIsoFormat()
            lunar_month_day = lunar_month_day[5:7] + lunar_month_day[8:]
            if lunar_month_day == '0101':
                is_holiday = True
    return is_holiday

def datetimeToDate(date):
    this_month = date.month
    this_day = date.day
    if this_month < 10:
        this_month = '0' + str(this_month)
    else:
        this_month = str(this_month)
    if this_day < 10:
        this_day = '0' + str(this_day)
    else:
        this_day = str(this_day)
    date = this_month + this_day
    return date

def check_time():
    today = datetime.date.today()
    now = datetime.datetime.now()
    hour = now.hour
    today = today.strftime("%Y-%m-%d")
    month = now.month
    year = now.year
    start = datetime.datetime(year, month, 1, 0, 0, 0)
    start = start.strftime("%Y-%m-%d")
    month = month + 1
    if month == 13:
        month = 1
        year = year + 1
    end = datetime.datetime(year, month, 1, 0, 0, 0)
    end = end.strftime("%Y-%m-%d")
    this_month = {'start': start, 'end': end}
    return hour, today, this_month

def check_hour():
    today = datetime.date.today()
    today = today.strftime("%Y-%m-%d")
    now = datetime.datetime.now()
    hour = correct_time(now.hour)
    minute = correct_time(now.minute)
    second = correct_time(now.second)
    return today, hour + minute + second

def correct_time(time):
    if int(time) < 10:
        time = '0' + str(time)
    else:
        time = str(time)
    return time

def get_delta_day(date, delta=None):
    date = datetime.datetime(int(date[0:4]), int(date[5:7]), int(date[8:10]), 0, 0, 0)
    if delta is not None:
        if delta >= 0:
            date = date + timedelta(days=delta)
        else:
            delta = -1 * delta
            date = date - timedelta(days=delta)
    date = date.strftime("%Y-%m-%d")
    return date
