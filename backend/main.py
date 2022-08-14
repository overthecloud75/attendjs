import os
import threading
import time

from models import Report, Device, DeviceOn
from utils import Scanner
from config import BASE_DIR, LOG_DIR, USE_WIFI_ATTENDANCE

if os.path.exists(os.path.join(BASE_DIR, LOG_DIR)):
    pass
else:
    os.mkdir(os.path.join(BASE_DIR, LOG_DIR))


def save_db():
    report = Report()
    report.update()

def check_mac():
    devices = Device()
    device_on = DeviceOn()
    scanner = Scanner()

    macs = []
    data_list = devices.get_mac_list()
    for data in data_list:
        macs.append(data['mac'])
    while True:
        wifi_connected = scanner.check_wifi_connected()
        if not wifi_connected:
            scanner.connect_wifi()

        scan_result = scanner.check_nmap()
        for network in scan_result:
            if network['mac'] not in macs:
                macs.append(network['mac'])
                devices.new_post(network)
            else:
                devices.old_post(network)
            device_on.post(network)
        time.sleep(60)


if __name__ == '__main__':
    if USE_WIFI_ATTENDANCE:
        th = threading.Thread(target=check_mac)
        th.daemon = True
        th.start()

    while True:
        save_db()
        print('save_db')
        time.sleep(1800)

        
        
