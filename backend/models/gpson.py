from .db import BasicModel
from utils import get_delta_day
from config import WORKING


class GPSOn(BasicModel):
    def __init__(self):
        super().__init__(model='gpsons')

    def get_attend(self, date=None):
        return self.collection.find({'date': date})
