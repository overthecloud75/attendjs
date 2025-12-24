import os 
import time
import logging
from logging.config import dictConfig

from models.report import Report
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
report = Report()

def save_db():
    try:
        logger.info('update')
        report.update(date=None)
    except Exception as e:
        logger.error(e, exc_info=True)
    time.sleep(1800)

if __name__ == '__main__':
    while True:
        save_db()
        

        
        
