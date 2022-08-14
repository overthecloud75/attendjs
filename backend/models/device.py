from .db import BasicModel
from .employee import Employee

# Device
class Device(BasicModel):
    def __init__(self):
        super().__init__(model='devices')
        self.employee = Employee()

    def get_mac_list(self, date=None):
        device_list = self.collection.find(sort=[('ipStr', 1)])
        return device_list

    def new_sn_post(self, request_data): # new device 발견인 경우
        request_data = {'mac': request_data['mac'], 'registerDate': request_data['date'], 'endDate': request_data['date'],
                        'owner': None, 'ip': request_data['ip'], 'ipStr': request_data['ipStr'], 'vendor': request_data['vendor']}
        self.collection.update_one({'mac': request_data['mac']}, {'$set': request_data}, upsert=True)

    def old_sn_post(self, request_data):
        request_data = {'mac': request_data['mac'], 'endDate': request_data['date'], 'ip': request_data['ip'],
                        'ipStr': request_data['ipStr'], 'vendor': request_data['vendor']}
        self.collection.update_one({'mac': request_data['mac']}, {'$set': request_data}, upsert=True)

    def new_o_post(self, request_data): # new device 발견인 경우
        self.collection.update_one({'mac': request_data['mac']}, {'$set': request_data}, upsert=True)

    def old_o_post(self, request_data):
        self.collection.update_one({'mac': request_data['mac']}, {'$set': request_data}, upsert=True)
    
    def post(self, request_data):
        if 'owner' in request_data and request_data['owner'] == 'None':
            request_data['owner'] = None
        if 'owner' in request_data and request_data['owner']:
            employees_list = self.employee.get()
            for employee in employees_list:
                name = employee['name']
                employee_id = employee['employeeId']
                if request_data['owner'] == name:
                    request_data['employeeId'] = employee_id
        self.collection.update_one({'mac': request_data['mac']}, {'$set': request_data}, upsert=True)

    def by_employees(self, date=None):
        device_list = self.get_mac_list(date=date)
        device_dict = {}
        for device in device_list:
            if 'owner' in device:
                if device['owner']:
                    # device가 여러개 있는 경우
                    if device['owner'] in device_dict:
                        device_dict[device['owner']].append(device['mac'])
                    else:
                        device_dict[device['owner']] = [device['mac']]
        return device_dict