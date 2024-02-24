import os

# log
BASE_DIR= os.getcwd()
LOG_DIR = 'logs'

if not os.path.exists(os.path.join(BASE_DIR, LOG_DIR)):
    os.mkdir(os.path.join(BASE_DIR, LOG_DIR))

# date
DATE_FORMAT = '%Y-%m-%d'

# working
WORKING = {
    'time': {'beginTime': '100000', 'lunchTime': '123000', 'lunchFinishTime': '133000', 'overNight': '040000'},
}
