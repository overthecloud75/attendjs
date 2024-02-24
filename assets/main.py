import os 
import threading
import time
import logging
from logging.config import dictConfig

from models import Device, DeviceOn
from utils import Scanner
from config import BASE_DIR, LOG_DIR


dictConfig({
    'version': 1,
    'formatters': {
        'default': {
            'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
        }
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, LOG_DIR, 'project.log'),
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 5,
            'formatter': 'default',
        },
    },
    'root': {
        'level': 'INFO',
        'handlers': ['file']
    }
})
logger = logging.getLogger(__name__)

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
        try:
            logger.info('update')
            wifi_connected = scanner.check_wifi_connected()
            if not wifi_connected:
                scanner.connect_wifi()

            scan_result = scanner.nmap_o_scan()
            for network in scan_result:
                if 'mac' in network:
                    devices.o_post(network)
                else:
                    devices.ip_o_post(network)
        except Exception as e:
            logger.error(e)
        time.sleep(7200)

if __name__ == '__main__':
    devices = Device()
    device_on = DeviceOn()
    scanner = Scanner()
        
    th1 = threading.Thread(target=check_sn)
    th1.daemon = True
    th1.start()
    
    check_o() 