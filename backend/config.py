import os

# log
BASE_DIR= os.getcwd()
LOG_DIR = 'logs'

if not os.path.exists(os.path.join(BASE_DIR, LOG_DIR)):
    os.mkdir(os.path.join(BASE_DIR, LOG_DIR))

DOMAIN = 'https://smartwork.adoscompany.com'

# wift attend
USE_WIFI_ATTENDANCE = False

# gps attend
USE_GPS_ATTENDANCE = True

# email setting
USE_NOTICE_EMAIL = True
EMAIL_NOTICE_BASE = ['미출근', '지각']

# working
WORKING = {
    'time': {'beginTime': '100000', 'lunchTime': '123000', 'lunchFinishTime': '133000', 'overNight': '040000'},
    'inStatus': ['정상출근', '지각', '미출근'],
    'outStatus': {'반차': ['오전반차, 오후반차']},
    'update': ['상근', '병특'],
    'reason': {'휴가': 0, '반차': 4, '오전반차': 4, '오후반차': 4, '외근': 8, '재택': 8, '출근': 8, '기타': 8},
    'offDay': {'휴가': 1, '반차': 0.5, '지각': 0, '미출근': 0},
    'holidays': ['0101', '0301', '0501', '0505', '0606', '0717', '0815', '1003', '1009', '1225'],
    'specialHolidays': ['선거', '명절', '휴일'],
    'lunarHolidays': ['0101', '0102', '0408', '0814', '0815', '0816'],
    'alternativeVacation': ['0301', '0505', '0815', '1003', '1009']
}

# holiday
USE_LUNAR_NEW_YEAR = True

# date
DATE_FORMAT = '%Y-%m-%d'
