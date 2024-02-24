from .db import BasicModel
from .employee import Employee

# Device
class Device(BasicModel):
    def __init__(self):
        super().__init__(model='devices')
        self.employee = Employee()

    def get_mac_list(self, date=None):
        # https://www.mongodb.com/docs/manual/reference/operator/query/and/
        # db.inventory.find( { $and: [ { price: { $ne: 1.99 } }, { price: { $exists: true } } ] } )
        device_list = self.collection.find({'endDate': date, '$and' : [{'owner': {'$exists': True}}, {'owner': {'$ne': None}}]}, sort=[('ipStr', 1)])
        return device_list

    def by_employees(self, date=None):
        device_list = self.get_mac_list(date=date)
        device_dict = {}
        for device in device_list:
            if 'employeeId' in device and device['owner']:
                # device가 여러개 있는 경우
                if device['employeeId'] in device_dict:
                    device_dict[device['employeeId']].append(device['mac'])
                else:
                    device_dict[device['employeeId']] = [device['owner'], device['mac']]
        return device_dict