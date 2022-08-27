import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from config import SMTP_CONFIG
try:
    from mainconfig import ACCOUNT, MAIL_SERVER, CC
except Exception as e:
    from testconfig import ACCOUNT, MAIL_SERVER, CC
    
def send_email(email=None, subject=None, body=None, include_cc=False):
    mimemsg = MIMEMultipart()
    mimemsg['From'] = ACCOUNT['email']
    mimemsg['To'] = email
    if include_cc and CC is not None:
        mimemsg['Cc'] = CC
    mimemsg['Subject'] = subject
    mimemsg.attach(MIMEText(body, 'plain'))
    try:
        connection = smtplib.SMTP(host=MAIL_SERVER['host'], port=MAIL_SERVER['port'])
        connection.starttls()
        connection.login(ACCOUNT['email'], ACCOUNT['password'])
        connection.send_message(mimemsg)
        connection.quit()
        return True

    except Exception as e:
        print(e)
        return False

'''def send_email(email=None, subject=None, body=None, include_cc=False):
    mimemsg = MIMEMultipart()
    mimemsg['From'] = 'help@121.167.147.114'
    mimemsg['To'] = 'rainbow@mirageworks.co.kr'
    CC = None
    if include_cc and CC is not None:
        mimemsg['Cc'] = CC
    mimemsg['Subject'] = subject
    mimemsg.attach(MIMEText(body, 'plain'))
    try:
        connection = smtplib.SMTP(host=SMTP_CONFIG['host'], port=SMTP_CONFIG['port'])
        #connection.starttls()
        #connection.login(ACCOUNT['email'], ACCOUNT['password'])
        r = connection.send_message(mimemsg)
        print('r', r)
        connection.quit()
        return True

    except Exception as e:
        print(e)
        return False'''