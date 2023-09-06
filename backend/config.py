import os

# log
BASE_DIR= os.getcwd()
LOG_DIR = 'logs'

# smtp_server
SMTP_CONFIG = {'host' : '127.0.0.1', 
               'port' : 25
}

# paging
PAGE_DEFAULT = {
    'per_page': 20,
    'screen_pages': 10
}

# wift attend
USE_WIFI_ATTENDANCE = True

# gps attend
USE_GPS_ATTENDANCE = True

# email setting
USE_NOTICE_EMAIL = True
EMAIL_NOTICE_BASE = ['미출근', '지각']

# working
WORKING = {
    'time': {'beginTime': '100000', 'lunchTime': '123000', 'lunchFinishTime': '133000', 'overNight': '040000'},
    'inStatus': ['정상출근', '지각', '미출근'],
    'update': ['상근', '병특'],
    'status': {'연차': 0, '휴가': 0, '월차': 0, '공가': 0, '병가': 0, '반차': 4, '출장': 8, '설명회': 8, '미팅': 8, '평가': 8,
               '외근': 8, '파견': 8, '재택': 8, '정기점검': 8, '출근': 8, '기타': 8},
    'offDay': {'연차': 1, '휴가': 1, '월차': 1, '공가': 1, '병가': 1, '반차': 0.5, '지각': 0.25, '미출근': 1},
    'holidays': ['0301', '0501', '0505', '0606', '0717', '0815', '1003', '1009', '1225'],
    'specialHolidays': ['선거', '명절', '휴일'],
    'lunarHolidays': ['0101', '0102', '0408', '0814', '0815', '0816'],
    'alternativeVacation': ['0301', '0505', '0815', '1003', '1009']
}

# holiday
USE_LUNAR_NEW_YEAR = True

# security
PRIVATE_IP_RANGE = '192.168.0.0'

# employees
EMPLOYEES_STATUS = {
    'department': ['연구소', '솔루션', '컨설팅', '기획', '아도스'],
    'position': ['팀원', '팀장', '본부장', '대표이사'],
    'regular': ['상근', '병특', '비상근', '휴직', '퇴사'],
    'mode': ['내근', '파견'],
}

# approval
APPROVAL_REASON = ['휴가', '반차', '재택', '기타']

# date
DATE_FORMAT = '%Y-%m-%d'
