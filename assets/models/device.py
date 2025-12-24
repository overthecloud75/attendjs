from .db import BasicModel
from .employee import Employee

# Device
class Device(BasicModel):
    def __init__(self):
        super().__init__(model='devices')
        self.employee = Employee()

    def sn_post(self, request_data): 
        result = self.collection.find_one({'mac': request_data['mac']})
        if result is None:
            request_data = {'mac': request_data['mac'], 'registerDate': request_data['date'], 'endDate': request_data['date'],
                        'owner': None, 'ip': request_data['ip'], 'ipStr': request_data['ipStr'], 'vendor': request_data['vendor']}
        else:
            request_data = {'mac': request_data['mac'], 'endDate': request_data['date'], 'ip': request_data['ip'],
                        'ipStr': request_data['ipStr'], 'vendor': request_data['vendor']}
        self.collection.update_one({'mac': request_data['mac']}, {'$set': request_data}, upsert=True)

    def ip_sn_post(self, request_data): 
        result = self.collection.find_one({'ip': request_data['ip']})
        if result is None:
            request_data = {'registerDate': request_data['date'], 'endDate': request_data['date'],
                        'owner': None, 'ip': request_data['ip'], 'ipStr': request_data['ipStr'], 'vendor': request_data['vendor']}
        else:
            request_data = {'endDate': request_data['date'], 'ip': request_data['ip'],
                        'ipStr': request_data['ipStr'], 'vendor': request_data['vendor']}
        self.collection.update_one({'ip': request_data['ip']}, {'$set': request_data}, upsert=True)

    def o_post(self, request_data): 
        self.collection.update_one({'mac': request_data['mac']}, {'$set': request_data}, upsert=True)
    
    def ip_o_post(self, request_data):
        self.collection.update_one({'ip': request_data['ip']}, {'$set': request_data}, upsert=True)

    def post(self, request_data):
        if 'owner' in request_data and request_data['owner'] == 'None':
            request_data['owner'] = None
        if 'owner' in request_data and request_data['owner']:
            employees_list = self.employee.get_list()
            for employee in employees_list:
                name = employee['name']
                employee_id = employee['employeeId']
                if request_data['owner'] == name:
                    request_data['employeeId'] = employee_id
        self.collection.update_one({'mac': request_data['mac']}, {'$set': request_data}, upsert=True)