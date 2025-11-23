from config import DOMAIN
from .util import check_this_year, convert_to_time_string


def render_notice_html(name, report):
    '''근태 안내 메일 HTML 생성'''
    action_html = f'''
        <h2 style="margin-top:0;">안녕하세요, {name}님</h2>
        <p style="color:#444;">근태 관련하여 아래와 같은 사유가 있어 안내 메일을 송부합니다.</p>
    '''

    table_html = f'''
        <tr>
            <td style="padding:8px; border-bottom:1px solid #e0e0e0;">이름</td>
            <td style="padding:8px; border-bottom:1px solid #e0e0e0;">{name}</td>
        </tr>
        <tr>
            <td style="padding:8px; border-bottom:1px solid #e0e0e0;">날짜</td>
            <td style="padding:8px; border-bottom:1px solid #e0e0e0;">{report['date']}</td>
        </tr>
        <tr>
            <td style="padding:8px; border-bottom:1px solid #e0e0e0;">출근 시각</td>
            <td style="padding:8px; border-bottom:1px solid #e0e0e0;">{convert_to_time_string(report['begin'])}</td>
        </tr>
        <tr>
            <td style="padding:8px; border-bottom:1px solid #e0e0e0;">근무 시간</td>
            <td style="padding:8px; border-bottom:1px solid #e0e0e0;">{report['workingHours']}</td>
        </tr>
        <tr>
            <td style="padding:8px;">사유</td>
            <td style="padding:8px;">{report['status']}</td>
        </tr>
    '''

    footer_html = f'''
        <div style="margin-top:24px; text-align:center;">
            연차, 외근 등의 사유가 있는 경우<br>
            아래 버튼을 통해 출근 품의를 진행하면 근태가 정정됩니다.
        </div>
    '''

    return render_base_template(action_html, table_html, footer_html)

def render_footer_link(link_text = '📋 SmartWork 바로가기'):
    return f'''
        <div style="text-align:center; margin-top:24px;">
            <a href="{DOMAIN}" 
            style="background-color:#007bff; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-size:14px;">
            {link_text}
            </a>
        </div>
        <p style="text-align:center; margin-top:32px; font-size:13px; color:#aaa;">
            {check_this_year()} SmartWork. All rights reserved.
        </p>
    '''

def render_base_template(action_html = '', table_html = '', footer_html = ''):
    return f'''
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e0e0e0; padding: 24px;">
            {action_html}
            <table style="width:100%; border-collapse: collapse; margin-top:16px;">
                {table_html}
            </table>
            {footer_html}
            {render_footer_link()}
        </div>
    '''