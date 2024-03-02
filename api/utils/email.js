import nodemailer from 'nodemailer'
import { logger } from '../config/winston.js'

const makeTransport = () => {
    const host = process.env.MAIL_HOST
    let options = {
        host,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.ACCOUNT_EMAIL,
            pass: process.env.ACCOUNT_PASSWORD,
        },
    }
    switch (host) {
        case 'smtp.gmail.com':
            options.secure = true
            break
        case 'smtp.office365.com':
            options.secureConnection = false
            options.tls = {ciphers: 'SSLv3'}
            break 
        default:
            options.secure = false
            options.ignoreTLS = true 
    }
    const transport = nodemailer.createTransport(options)
    return transport
}

export const registerConfirmationEmail = async (name, email, confirmationCode) => {
    logger.info('send register confirmaition email')  
    try {
        const transport = makeTransport()
        await transport.sendMail({
            from: 'HR_MANAGER' + '<' + process.env.ACCOUNT_EMAIL + '>',
            to: email,
            subject: '[SmartWork] Please confirm your account',
            html: `<h2>Hello ${name}</h2>
                <p>Thank you for subscribing.</p>
                <P>Please confirm your email by clicking on the following link</p>
                <a href=${process.env.DOMAIN}/confirm/${confirmationCode}> Click here</a>`,
        })
    } catch(err) {
        logger.error(err)
    }
}

export const attendRequestEmail = async (approval, summary) => {
    logger.info('send attend request email')  
    try {
        const transport = makeTransport()
        await transport.sendMail({
            from: 'HR_MANAGER' + '<' + process.env.ACCOUNT_EMAIL + '>',
            to: approval.approverEmail,
            subject: `[근태 결재] ${approval.department}팀 ${approval.name} ${approval.reason} 신청. 기간: ${approval.start}~${approval.end}`,
            html: `<h3>안녕하세요. ${approval.approverName}님</h3>
                <p>${approval.name}님이 다음과 같이 근태 신청을 하였습니다.</p>
                <p>이름 : ${approval.name}</p>
                <p>기간 : ${approval.start}~${approval.end}</p>
                <p>연차기준 : ${summary.baseDate}</p>
                <p>근태현황 : 남은연차 ${summary.leftAnnualLeave}, 미출근 ${summary['미출근']}, 지각 ${summary['지각']}, 휴가 ${summary['휴가']}</p>
                <p>사유 : ${approval.reason}</p>
                <p>기타 : ${approval.etc}</p>
                <a href=${process.env.DOMAIN}/api/event/confirm/approval/${approval._id.toString()} class="button" style="background-color: #0071c2; border: none; border-radius: 8px; color: white; padding: 15px 15px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 5px; cursor: pointer;">승인</a>
                <a href=${process.env.DOMAIN}/api/event/confirm/cancel/${approval._id.toString()} class="button" style="background-color: #dc3545; border: none; border-radius: 8px; color: white; padding: 15px 15px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 5px; cursor: pointer;">취소</a>`    
        })
    } catch(err) {
        logger.error(err)
    }
}

export const attendConfirmationEmail = async (approval, status) => {
    logger.info('send attend confirmation email')  
    let action
    let cc = ''
    if (status==='Active') {
        action = '승인'
        if (['휴가', '반차'].includes(approval.reason)) {
            cc = cc + process.env.CC_email
        }
    } else if (status==='Cancel') {action = '반려'}
    else {action = '취소'}
    try {
        const transport = makeTransport()
        await transport.sendMail({
            from: 'HR_MANAGER' + '<' + process.env.ACCOUNT_EMAIL + '>',
            to: approval.email,
            cc: cc,
            subject: `[결재 ${action}] ${approval.department}팀 ${approval.name} ${approval.reason} 신청. 기간: ${approval.start}~${approval.end}`,
            html: `<h3>안녕하세요. ${approval.name}님</h3>
                <p>${approval.name}님의 근태 신청이 ${action} 되었습니다.</p>
                <p>이름 : ${approval.name}</p>
                <p>기간 : ${approval.start}~${approval.end}</p>
                <p>사유 : ${approval.reason}</p>
                <p>기타 : ${approval.etc}</p>` 
        })
    } catch(err) {
        logger.error(err) 
    }
}