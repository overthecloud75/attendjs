import os
import subprocess
import locale
import nmap
import datetime
from datetime import timedelta
from korean_lunar_calendar import KoreanLunarCalendar

from config import PAGE_DEFAULT, WORKING, USE_LUNAR_NEW_YEAR, PRIVATE_IP_RANGE
try:
    from mainconfig import WIFI, SCAN_RANGE_LIST
except Exception as e:
    # use your own wifi ip and router name
    # PSRC: server wifi ip
    WIFI = {
        'NET': '192.168.2.0/24',
        'PSRC': '192.168.2.2',
        'PDST': '192.168.2.',
        'NAME_OF_ROUTER': 'default'
    }
    SCAN_RANGE_LIST = ['192.168.0.0/24']

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


def get_date_several_months_before(date, delta=1):
    year = int(date[0:4])
    month = int(date[5:7])
    month = month - delta
    if month <= 0:
        abs_month = abs(month)
        year = year - abs_month // 12 - 1
        month = 12 - abs_month % 12
    day = int(date[8:10])
    if day > 28:
        day = 28
    date = datetime.datetime(year, month, day, 0, 0, 0)
    date = date.strftime("%Y-%m-%d")
    return date


# https://jsikim1.tistory.com/140
def date_range(start, end):
    date_list = []
    try:
        start = datetime.datetime.strptime(start, '%Y-%m-%d')
        end = datetime.datetime.strptime(end, '%Y-%m-%d')
        date_list = [(start + timedelta(days=i)).strftime("%Y-%m-%d") for i in range((end - start).days + 1)]
    except Exception as e:
        print(e)
    return date_list


def request_get(request_data):
    page = int(request_data.get('page', 1))
    name = request_data.get('name', None)
    start = request_data.get('start', '')

    if start and len(start) >=5:
        if start[4] != '-':
            start = start[6:] + '-' + start[:2] + '-' + start[3:5]
    end = request_data.get('end', '')

    if end and len(end) >=5:
        if end[4] != '-':
            end = end[6:] + '-' + end[:2] + '-' + end[3:5]
    return page, name, start, end


def request_event(request_data):
    title = request_data.get('title', None)
    start = request_data.get('start', None)
    end = request_data.get('end', None)
    id = request_data.get('id', None)
    if start is not None:
        start = start[:10]
    if end is not None:
        end = end[:10]
    if id is not None:
        id = int(id)
    return title, start, end, id


def request_delta(request_data):
    title = request_data.get('title', None)
    id = request_data.get('id', None)
    delta = request_data.get('delta', None)
    if id is not None:
        id = int(id)
    if delta is not None:
        delta = int(delta)
    return title, id, delta


def check_private_ip(ip):
    ip = ip.split(':')[0]  # port 정보가 넘어오는 경우 port 정보를 빼기 위함 
    ip = ip.split('.')
    private_ip_range = PRIVATE_IP_RANGE.split('.')

    is_private_ip = True
    for i, table in enumerate(private_ip_range):
        if table != '0':
            if ip[i] != private_ip_range[i]:
                is_private_ip = False
                break
    return is_private_ip
