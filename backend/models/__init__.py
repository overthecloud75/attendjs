from .device import Device
from .report import Report
from .deviceon import DeviceOn
from .gpson import GPSOn

try:
    from mainconfig import ACCOUNT
except Exception as e:
    ACCOUNT = {
        'email': 'test@test.co.kr',
        'password': '*******',
    }
try:
    from mainconfig import CC
except Exception as e:
    # CC: cc email when notice email
    # CC = 'test@test.co.kr'
    CC = None
