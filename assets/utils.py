import os
import subprocess
import nmap
import locale
import datetime
import logging

try:
    from mainconfig import WIFI, SCAN_RANGE_LIST
except Exception as e:
    from testconfig import WIFI, SCAN_RANGE_LIST

from config import DATE_FORMAT

class Scanner:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.logger.info('Start')
        self.nm = nmap.PortScanner()

    def nmap_sn_scan(self):
        network_list = []
        date, time = check_hour()
        for ip_range in SCAN_RANGE_LIST:
            try:
                result = self.nm.scan(ip_range, arguments='-sn')
            except Exception as e:
                print(ip_range, e)
            else:
                if result['scan']:
                    for ip in result['scan']:
                        # ip 정렬 문제로 ip_str 필요
                        ip_str = self.make_ip_str(ip)
                        ipv4 = result['scan'][ip]['addresses']['ipv4']
                        network = {'ip': ipv4, 'ipStr': ip_str, 'date': date, 'time': time, 'vendor': ''}
                        mac = ''
                        if 'mac' in result['scan'][ip]['addresses']:
                            mac = result['scan'][ip]['addresses']['mac']
                            # nmap으로 하는 경우 mac 값이 대문자로 표시가 됨 -> 소문자로 변경 필요
                            network['mac'] = mac.lower()
                        if mac and mac in result['scan'][ip]['vendor']:
                            network['vendor'] = result['scan'][ip]['vendor'][mac]
                        network_list.append(network)
        return network_list

    def nmap_o_scan(self):
        network_list = []
        for ip_range in SCAN_RANGE_LIST:
            result = self.nm.scan(ip_range, arguments='-O')
            if result['scan']:
                for ip in result['scan']:
                    network = {'ip': ip, 'os': '', 'accuracy': ''}
                    if 'mac' in result['scan'][ip]['addresses']:
                        mac = result['scan'][ip]['addresses']['mac']
                        network['mac'] = mac.lower()
                    if result['scan'][ip]['osmatch']:
                        network['os'] = result['scan'][ip]['osmatch'][0]['name']
                        network['accuracy'] = result['scan'][ip]['osmatch'][0]['accuracy'] 
                    network_list.append(network)
        return network_list

    def check_wifi_connected(self):
        if os.name == 'nt':
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
                if interface == 'wi-fi' and (status in ['연결됨', 'connected']):
                    connected = True
        else:
            try:
                output = subprocess.check_output(['iwconfig', WIFI['NAME_OF_ROUTER']])
                if b"ESSID:off/any" in output:
                    connected = False
                else:
                    connected = True
            except subprocess.CalledProcessError:
                connected = False 
        return connected

    def connect_wifi(self):
        if os.name:
            os.system(f'''cmd /c "netsh wlan connect name={WIFI['NAME_OF_ROUTER']}"''')
        else:
            subprocess.run(['iwconfig', WIFI['NAME_OF_ROUTER'], 'txpower', 'auto'])

    def make_ip_str(self, ip):
        ip_split_list = ip.split('.')
        ip_str = ''
        for ip_split in ip_split_list:
            ip_part = ip_split
            if len(ip_split) == 2:
                ip_part = f'0{ip_split}'
            elif len(ip_split) == 1:
                ip_part = f'00{ip_split}'

            if ip_str == '':
                ip_str = ip_part
            else:
                ip_str = f'{ip_str}.{ip_part}'
        return ip_str

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
            date = date + datetime.timedelta(days=delta)
        else:
            delta = -1 * delta
            date = date - datetime.timedelta(days=delta)
    date = date.strftime(DATE_FORMAT)
    return date
