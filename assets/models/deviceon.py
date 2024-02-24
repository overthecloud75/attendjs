from .db import BasicModel
from utils import get_delta_day
from config import WORKING


class DeviceOn(BasicModel):
    def __init__(self):
        super().__init__(model='deviceons')

    def post(self, request_data):
        data = {'mac': request_data['mac'], 'ip': request_data['ip'], 'end': request_data['time']}
        date = request_data['date']
        if data['end'] <= WORKING['time']['overNight']:
            date = get_delta_day(date, delta=-1)
        data['date'] = date
        previous_data = self.collection.find_one({'mac': data['mac'], 'ip': data['ip'], 'date': data['date']})
        if previous_data is None:
            data['begin'] = request_data['time']
        self.collection.update_one({'mac': data['mac'], 'ip': data['ip'], 'date': data['date']}, {'$set': data}, upsert=True)