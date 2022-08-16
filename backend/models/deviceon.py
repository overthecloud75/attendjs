from .db import BasicModel
from utils import get_delta_day
from config import WORKING


class DeviceOn(BasicModel):
    def __init__(self):
        super().__init__(model='deviceons')

    def get_attend_by_mac_list(self, mac_list=[], date=None):
        begin = None
        end = None
        for mac in mac_list:
            data = self.collection.find_one({'date': date, 'mac': mac})
            if data:
                if begin and int(begin) > int(data['begin']):
                    begin = data['begin']
                elif not begin:
                    begin = data['begin']
                if  end and int(end) < int(data['end']):
                    end = data['end']
                elif not end:
                    end = data['end']
        return begin, end

    def get_device_list(self, date=None):
        device_list = []
        data_list = self.collection.aggregate([
            {'$match': {'date': date}},
            {'$group': {'_id': {'mac': '$mac', 'ip': '$ip'}}}])
        for data in data_list:
            for key in data:
                device_list.append(data[key])
        return device_list

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