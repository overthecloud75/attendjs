import os
import threading
import time

from models import Report, Device, DeviceOn
from utils import Scanner
from config import BASE_DIR, LOG_DIR, USE_WIFI_ATTENDANCE, CHECK_DEVICE

if not os.path.exists(os.path.join(BASE_DIR, LOG_DIR)):
    os.mkdir(os.path.join(BASE_DIR, LOG_DIR))

def save_db(report):
    report.update()
    time.sleep(1800)

# nmap -sn 
def check_sn():
    while True:
        wifi_connected = scanner.check_wifi_connected()
        if not wifi_connected:
            scanner.connect_wifi()

        scan_result = scanner.nmap_sn_scan()
        for network in scan_result:
            if 'mac' in network:
                devices.sn_post(network)
                device_on.post(network)
            else:
                devices.ip_sn_post(network)
           
        time.sleep(60)

# nmap -O
def check_o():
    while True:
        wifi_connected = scanner.check_wifi_connected()
        if not wifi_connected:
            scanner.connect_wifi()

        scan_result = scanner.nmap_o_scan()
        for network in scan_result:
            if 'mac' in network:
                devices.o_post(network)
            else:
                devices.ip_o_post(network)
        time.sleep(7200)

if __name__ == '__main__':
    devices = Device()
    device_on = DeviceOn()
    scanner = Scanner()
    report = Report()

    if CHECK_DEVICE:
        th1 = threading.Thread(target=check_sn)
        th1.daemon = True
        th1.start()
        th2 = threading.Thread(target=check_o)
        th2.daemon = True
        th2.start()

    while True:
        save_db(report)
        

        
        
