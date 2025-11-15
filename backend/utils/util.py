import datetime
from datetime import timedelta
from korean_lunar_calendar import KoreanLunarCalendar

from config import WORKING, USE_LUNAR_NEW_YEAR, DATE_FORMAT


lunar_calendar = KoreanLunarCalendar()

def check_holiday(date):
    is_holiday = False
    year = date[0:4]
    month = date[5:7]
    day = date[8:]
    month_day = f'{month}{day}'

    date = datetime.datetime(int(year), int(month), int(day), 1, 0, 0)  # str -> datetime으로 변환
    lunar_month_day = get_lunar_day(year, month_day)
    if month_day in WORKING['holidays'] or lunar_month_day in WORKING['lunarHolidays']:
        is_holiday = True
    elif date.weekday() in [5, 6]:
        is_holiday = True
    elif date.weekday() == 0:
        # 대체공휴일 적용
        yesterday = datetime_to_date(date - timedelta(days=1))
        lunar_yesterday = get_lunar_day(year, yesterday)

        two_days_ago = datetime_to_date(date - timedelta(days=2))
        lunar_two_days_ago = get_lunar_day(year, two_days_ago)
        if any(day in WORKING['alternativeVacation'] for day in [yesterday, two_days_ago]):
            is_holiday = True
        if any(day in ['0101', '0815'] for day in [lunar_yesterday, lunar_two_days_ago]):
            is_holiday = True
        
    if not is_holiday and USE_LUNAR_NEW_YEAR and int(month) < 3:
        # 음력 1월 1일 전날의 날짜를 특정하기 어려워서 아래의 logic을 사용
        # 12월 29일수도 있고 12월 30일일 수도 있음 윤달이 있으면 단순히 처리하기 쉽지 않음
        tomorrow = datetime_to_date(date + timedelta(days=1))
        lunar_tomorrow = get_lunar_day(year, tomorrow)
        if lunar_tomorrow == '0101':
            is_holiday = True
    return is_holiday

def datetime_to_date(date):
    this_month = date.month
    this_day = date.day
    if this_month < 10:
        this_month = f'0{str(this_month)}'
    else:
        this_month = str(this_month)
    if this_day < 10:
        this_day = f'0{str(this_day)}'
    else:
        this_day = str(this_day)
    date = f'{this_month}{this_day}'
    return date

def get_lunar_day(year, month_day):
    lunar_calendar.setSolarDate(int(year), int(month_day[0:2]), int(month_day[2:4]))
    lunar_date = lunar_calendar.LunarIsoFormat()
    return f'{lunar_date[5:7]}{lunar_date[8:]}'

def check_this_year():
    return datetime.datetime.now().year

def check_time():
    now = datetime.datetime.now()
    hour = now.hour
    today = datetime.date.today().strftime(DATE_FORMAT)
    month = now.month
    year = now.year
    start = datetime.datetime(year, month, 1, 0, 0, 0).strftime(DATE_FORMAT)
    month = month + 1
    if month == 13:
        month = 1
        year = year + 1
    end = datetime.datetime(year, month, 1, 0, 0, 0).strftime(DATE_FORMAT)
    this_month = {'start': start, 'end': end}
    return hour, today, this_month

def check_hour():
    today = datetime.date.today().strftime(DATE_FORMAT)
    now = datetime.datetime.now()
    hour = correct_time(now.hour)
    minute = correct_time(now.minute)
    second = correct_time(now.second)
    return today, f'{hour}{minute}{second}'

def correct_time(time):
    if int(time) < 10:
        time = f'0{str(time)}'
    else:
        time = str(time)
    return time

def get_delta_day(date, delta=None):
    date = datetime.datetime(int(date[0:4]), int(date[5:7]), int(date[8:10]), 0, 0, 0)
    if delta:
        if delta >= 0:
            date = date + timedelta(days=delta)
        else:
            delta = -1 * delta
            date = date - timedelta(days=delta)
    date = date.strftime(DATE_FORMAT)
    return date

def get_access_day(date, delta=0):
    if delta:
        date = get_delta_day(date, delta=delta)
    return date.replace('-', '')

def convert_to_time_string(begin=None):
    if begin:
        begin = f'{begin[0:2]}:{begin[2:4]}:{begin[4:6]}'
    return begin 

def calculate_working_hours(begin, end, overnight=False):
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
