import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
try:
    from mainconfig import ACCOUNT, MAIL_SERVER
except Exception as e:
    from testconfig import ACCOUNT, MAIL_SERVER
    
def send_email(email=None, subject=None, body=None, cc=None,include_cc=False):
    mimemsg = MIMEMultipart()
    mimemsg['From'] = 'HR_MANAGER' + '<' + ACCOUNT['email'] + '>'
    mimemsg['To'] = email
    if include_cc and cc:
        mimemsg['Cc'] = cc
    mimemsg['Subject'] = subject
    mimemsg.attach(MIMEText(body, 'plain'))
    try:
        connection = smtplib.SMTP(host=MAIL_SERVER['host'], port=MAIL_SERVER['port'])
        connection.starttls()
        if MAIL_SERVER['host'] == 'smtp.office365.com':
            connection.login(ACCOUNT['email'], ACCOUNT['password'])
        connection.send_message(mimemsg)
        connection.quit()
        return True

    except Exception as e:
        print(e)
        return False
