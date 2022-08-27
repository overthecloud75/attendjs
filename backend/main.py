import os
import threading
import time
from aiosmtpd.controller import Controller

from models import Report, Device, DeviceOn
from utils import Scanner, SMTPServer
from config import BASE_DIR, LOG_DIR, SMTP_CONFIG, USE_WIFI_ATTENDANCE

if os.path.exists(os.path.join(BASE_DIR, LOG_DIR)):
    pass
else:
    os.mkdir(os.path.join(BASE_DIR, LOG_DIR))

def save_db():
    report = Report()
    report.update()

# Arp Scan : nmap -sn 
def check_sn():
    while True:
        wifi_connected = scanner.check_wifi_connected()
        if not wifi_connected:
            scanner.connect_wifi()

        scan_result = scanner.nmap_sn_scan()
        for network in scan_result:
            if network['mac'] not in macs:
                macs.append(network['mac'])
                devices.new_sn_post(network)
            else:
                devices.old_sn_post(network)
            device_on.post(network)
        time.sleep(60)

# Arp Scan : nmap -O
def check_o():
    while True:
        wifi_connected = scanner.check_wifi_connected()
        if not wifi_connected:
            scanner.connect_wifi()

        scan_result = scanner.nmap_o_scan()
        for network in scan_result:
            if network['mac'] not in macs:
                devices.new_o_post(network)
            else:
                devices.old_o_post(network)
        time.sleep(7200)

def mail_server():
    controller = Controller(SMTPServer(), hostname=SMTP_CONFIG['host'], port=SMTP_CONFIG['port'])
    controller.start()


if __name__ == '__main__':
    devices = Device()
    device_on = DeviceOn()
    scanner = Scanner()
    data_list = devices.get_mac_list()
    macs = []

    for data in data_list:
        macs.append(data['mac'])

    if USE_WIFI_ATTENDANCE:
        th1 = threading.Thread(target=check_sn)
        th1.daemon = True
        th1.start()
        th2 = threading.Thread(target=check_o)
        th2.daemon = True
        th2.start()

    th3 = threading.Thread(target=mail_server)
    th3.daemon = True
    th3.start()

    while True:
        save_db()
        print('save_db')
        time.sleep(1800)

        
        
