from config import DOMAIN
from .util imprt check_this_year


def renderFooterLink(linkText = '📋 SmartWork 바로가기'):
    return f'
        <div style="text-align:center; margin-top:24px;">
            <a href="{DOMAIN}" 
            style="background-color:#007bff; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-size:14px;">
            {linkText}
            </a>
        </div>
        <p style="text-align:center; margin-top:32px; font-size:13px; color:#aaa;">
            {check_this_year()} SmartWork. All rights reserved.
        </p>
    '

def renderBaseTemplate(actionHtml = '', tableHtml = '', footerHtml = ''):
    return f'
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e0e0e0; padding: 24px;">
            {actionHtml}
            <table style="width:100%; border-collapse: collapse; margin-top:16px;">
                {tableHtml}
            </table>
            {footerHtml}
            {renderFooterLink()}
        </div>
    '