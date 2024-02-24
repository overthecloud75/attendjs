import datetime
from datetime import timedelta
from korean_lunar_calendar import KoreanLunarCalendar

from config import WORKING, USE_LUNAR_NEW_YEAR, DATE_FORMAT


def check_holiday(date):
    is_holiday = False
    year = date[0:4]
    month = date[5:7]
    day = date[8:]
    month_day = month + day

    date = datetime.datetime(int(year), int(month), int(day), 1, 0, 0)  # str -> datetime으로 변환

    lunar_calendar = KoreanLunarCalendar()
    lunar_calendar.setSolarDate(int(year), int(month), int(day))
    lunar_date = lunar_calendar.LunarIsoFormat()
    lunar_month_day = lunar_date[5:7] + lunar_date[8:]

    if month_day in WORKING['holidays'] or lunar_month_day in WORKING['lunarHolidays']:
        is_holiday = True
    elif date.weekday() == 5 or date.weekday() == 6:
        is_holiday = True
    elif date.weekday() == 0:
        # 대체공휴일 적용
        yesterday = date - timedelta(days=1)
        yesterday = datetimeToDate(yesterday)
        lunar_calendar.setSolarDate(int(year), int(yesterday[0:2]), int(yesterday[2:4]))
        lunar_date = lunar_calendar.LunarIsoFormat()
        lunar_yesterday = lunar_date[5:7] + lunar_date[8:]
        two_days_ago = date - timedelta(days=2)
        two_days_ago = datetimeToDate(two_days_ago)
        lunar_calendar.setSolarDate(int(year), int(two_days_ago[0:2]), int(two_days_ago[2:4]))
        lunar_date = lunar_calendar.LunarIsoFormat()
        lunar_two_days_ago = lunar_date[5:7] + lunar_date[8:]
        if yesterday in WORKING['alternativeVacation'] or two_days_ago in WORKING['alternativeVacation']:
            is_holiday = True
        if lunar_yesterday in ['0101', '0815'] or lunar_two_days_ago in ['0101', '0815']:
            is_holiday = True
        
    if not is_holiday and USE_LUNAR_NEW_YEAR and int(month) < 3:
        # 음력 1월 1일 전날의 날짜를 특정하기 어려워서 아래의 logic을 사용
        # 12월 29일수도 있고 12월 30일일 수도 있음 윤달이 있으면 단순히 처리하기 쉽지 않음
        tomorrow = date + timedelta(days=1)
        tomorrow = datetimeToDate(tomorrow)
        lunar_calendar.setSolarDate(int(year), int(tomorrow[0:2]), int(tomorrow[2:4]))
        lunar_date = lunar_calendar.LunarIsoFormat()
        lunar_month_day = lunar_date[5:7] + lunar_date[8:]
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
    return today, hour + minute + second

def correct_time(time):
    if int(time) < 10:
        time = '0' + str(time)
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
