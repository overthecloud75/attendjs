import nodemailer from 'nodemailer'
import { renderAuthTemplate, renderRequestTemplate, renderBaseTemplate } from './htmlTemplate.js'
import { logger } from '../config/winston.js'
import { APPROVAL_STATUS, LEAVE_TYPE } from '../config/domain.js'

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
            options.tls = { ciphers: 'SSLv3' }
            break
        default:
            options.secure = false
            options.ignoreTLS = true
    }
    const transport = nodemailer.createTransport(options)
    return transport
}

export const sendRegistrationConfirmationEmail = async (name, email, confirmationCode) => {
    logger.info(`📧 Sending register confirmation email to ${email}`)
    try {
        const transport = makeTransport()
        const title = '회원가입 확인'
        const confirmUrl = `${process.env.DOMAIN}/api/confirm/token/${confirmationCode}`

        const bodyHtml = `
            <p style="color: #555; line-height: 1.6;">
                SmartWork에 가입해 주셔서 감사합니다.<br>
                아래 버튼을 눌러 이메일 주소를 확인해 주세요.
            </p>

            <a href="${confirmUrl}" 
                style="display: inline-block; margin: 25px 0; padding: 12px 24px;
                background-color: #2563eb; color: white; text-decoration: none;
                border-radius: 8px; font-weight: bold;">
                이메일 주소 확인하기
            </a>

            <p style="font-size: 14px; color: #777;">
                버튼이 작동하지 않을 경우, 아래 링크를 복사하여 브라우저 주소창에 붙여넣기 해주세요.<br>
                <a href="${confirmUrl}" style="color: #2563eb;">${confirmUrl}</a>
            </p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

            <p style="font-size: 12px; color: #999; text-align: center;">
                본 메일은 SmartWork HR Manager에서 발송되었습니다.<br>
                회원가입을 요청하지 않으셨다면 이 메일을 무시하셔도 됩니다.
            </p>
        `
        const html = renderAuthTemplate(title, name, bodyHtml)

        await transport.sendMail({
            from: `SmartWork HR Manager <${process.env.ACCOUNT_EMAIL}>`,
            to: email,
            subject: '[SmartWork] Confirm your account',
            html,
        })
        logger.info(`✅ Confirmation email sent successfully to ${email}`)
    } catch (err) {
        logger.error(`❌ Failed to send confirmation email: ${err.message}`)
        logger.info(err.stack)
    }
}

export const sendPasswordResetOtpEmail = async (name, email, otp) => {
    logger.info(`📧 비밀번호 재설정용 OTP 메일을 ${email}로 발송합니다.`)

    try {
        const transport = makeTransport()

        const title = '비밀번호 재설정'
        const bodyHtml = `
            <p style="line-height: 1.6; color: #475569;">
                        비밀번호 재설정을 요청하셨습니다.<br />
                        아래의 OTP 코드를 입력하여 비밀번호를 재설정해주세요.
            </p>

            <div style="background-color: #f1f5ff; 
                        border: 1px solid #dbeafe;
                        border-radius: 10px; 
                        text-align: center; 
                        padding: 24px; 
                        margin: 24px 0;">
                <h3 style="margin: 0; 
                            font-size: 28px; 
                            color: #2563eb; 
                            letter-spacing: 2px;">
                    ${otp}
                </h3>
            </div>

            <p style="font-size: 14px; color: #64748b;">
                이 OTP는 <strong>보안을 위해 제한된 시간</strong> 동안만 유효합니다.<br>
                본인이 요청하지 않은 경우, 이 메일은 무시하셔도 됩니다.
            </p>
        `
        const html = renderAuthTemplate(title, name, bodyHtml)

        await transport.sendMail({
            from: `SmartWork HR Manager <${process.env.ACCOUNT_EMAIL}>`,
            to: email,
            subject: '[SmartWork] 비밀번호 재설정 OTP 안내',
            html,
        })

        logger.info(`✅ OTP 메일 발송 완료: ${email}`)
    } catch (err) {
        logger.error(`❌ OTP 메일 발송 실패: ${err.message}`)
        logger.error(err.stack)
    }
}

/**
 * 💌 근태 결재 요청 메일
 */
export const sendAttendRequestEmail = async (approval, summary) => {
    logger.info('📨 Sending attendance request email')

    const approveUrl = `${process.env.DOMAIN}/api/event/confirm/approval/${approval._id}`
    const cancelUrl = `${process.env.DOMAIN}/api/event/confirm/cancel/${approval._id}`

    const actionHtml = `
        <h2 style="color: #007bff; text-align:center;">근태 결재 요청</h2>
        <p style="color:#333;">안녕하세요, <strong>${approval.approverName}</strong>님.</p>
        <p style="color:#333;">${approval.name}님이 아래와 같이 근태 신청을 하였습니다.</p>
    `

    const tableHtml = `
        <tr><td style="padding:8px; font-weight:600;">이름</td><td>${approval.name}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">부서</td><td>${approval.department}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">기간</td><td>${approval.start} ~ ${approval.end}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">연차 기준일</td><td>${summary.baseDate}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">근태 현황</td>
            <td>남은 연차 ${summary.leftAnnualLeave}, 미출근 ${summary['미출근']}, 지각 ${summary['지각']}, 휴가 ${(summary['휴가'] + (summary['반차'] || 0) * 0.5)}</td>
        </tr>
        <tr><td style="padding:8px; font-weight:600;">사유</td><td>${approval.reason}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">기타</td><td>${approval.etc || '-'}</td></tr>
    `

    const html = renderRequestTemplate(actionHtml, tableHtml, approveUrl, cancelUrl)

    try {
        const transport = makeTransport()
        await transport.sendMail({
            from: `HR_MANAGER <${process.env.ACCOUNT_EMAIL}>`,
            to: approval.approverEmail,
            subject: `[근태 결재 요청] ${approval.department}팀 ${approval.name} - ${approval.reason} (${approval.start}~${approval.end})`,
            html,
        })
    } catch (err) {
        logger.error(err.stack || err)
    }
}


/**
 * 💬 근태 결재 결과 알림 메일
 */
export const sendAttendConfirmationEmail = async (approval, status) => {
    logger.info('📨 Sending attendance confirmation email')

    let action
    let cc = ''

    if (status === APPROVAL_STATUS.ACTIVE) {
        action = '승인'
        if ([LEAVE_TYPE.ANNUAL, LEAVE_TYPE.HALF, LEAVE_TYPE.SICK].includes(approval.reason)) {
            cc = process.env.CC_EMAIL || ''
        }
    } else if (status === APPROVAL_STATUS.CANCEL) {
        action = '반려'
    } else {
        action = '취소'
    }

    const actionHtml = `
        <h2 style="color: #007bff; text-align:center;">근태 결재 ${action} 안내</h2>
        <p style="color:#333;">안녕하세요, <strong>${approval.name}</strong>님.</p>
        <p style="color:#333;">귀하의 근태 신청이 <strong>${action}</strong>되었습니다.</p>
    `

    const tableHtml = `
        <tr><td style="padding:8px; font-weight:600;">부서</td><td>${approval.department}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">이름</td><td>${approval.name}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">기간</td><td>${approval.start} ~ ${approval.end}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">사유</td><td>${approval.reason}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">기타</td><td>${approval.etc || '-'}</td></tr>
    `
    const html = renderBaseTemplate(actionHtml, tableHtml)

    try {
        const transport = makeTransport()
        await transport.sendMail({
            from: `HR_MANAGER <${process.env.ACCOUNT_EMAIL}>`,
            to: approval.email,
            cc: cc || undefined,
            subject: `[결재 ${action}] ${approval.department}팀 ${approval.name} - ${approval.reason} (${approval.start}~${approval.end})`,
            html,
        })
    } catch (err) {
        logger.error(err.stack || err)
    }
}

/**
 * 💌 결재 요청/합의 요청 메일
 */
export const sendPaymentRequestEmail = async (approval, status, payment) => {
    let term, recipient, approverName, order

    if (status === APPROVAL_STATUS.PENDING) {
        logger.info('📨 Sending payment approval request email')
        term = '결재'
        recipient = approval.approverEmail
        approverName = approval.approverName
        order = '0'
    } else {
        logger.info('📨 Sending payment consent email')
        term = '합의'
        recipient = approval.consenterEmail
        approverName = approval.consenterName
        order = '1'
    }

    const approveUrl = `${process.env.DOMAIN}/api/payment/confirm/approval/${approval._id}/${order}`
    const cancelUrl = `${process.env.DOMAIN}/api/payment/confirm/cancel/${approval._id}/${order}`

    const actionHtml = `
        <h2 style="color: #007bff; text-align:center;">지출 ${term} 요청</h2>
        <p style="color:#333;">안녕하세요, <strong>${approverName}</strong>님.</p>
        <p style="color:#333;">${approval.name}님이 다음과 같이 지출 신청을 하였습니다.</p>
    `

    const tableHtml = `
        <tr><td style="padding:8px; font-weight:600;">이름</td><td>${approval.name}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">부서</td><td>${approval.department}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">사용일</td><td>${approval.start}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">카드번호</td><td>${approval.cardNo}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">사용내용</td><td>${approval.reason}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">사용금액</td><td>${approval.etc}</td></tr>
        <tr>
            <td style="padding:8px; font-weight:600;">증빙</td>
            <td style="padding:8px;">
                ${approval.content ? approval.content.replace(/<img /g, '<img style="max-width:100%; height:auto; margin-top:8px; border:1px solid #ccc; border-radius:8px;" ') : '-'}
            </td>
        </tr>
    `

    const html = renderRequestTemplate(actionHtml, tableHtml, approveUrl, cancelUrl)

    try {
        const transport = makeTransport()
        await transport.sendMail({
            from: `ACCOUNTING_MANAGER <${process.env.ACCOUNT_EMAIL}>`,
            to: recipient,
            subject: `[지출 ${term}] ${approval.department}팀 ${approval.name} - ${approval.reason} (${approval.start})`,
            html,
            attachments: payment?.destination ? [{
                filename: payment.fileName,
                path: payment.destination
            }] : []
        })
    } catch (err) {
        logger.error(err.stack || err)
    }
}

/**
 * 💬 결재/합의 결과 알림 메일
 */
export const sendPaymentConfirmationEmail = async (approval, status) => {
    logger.info('📨 Sending payment confirmation email')

    let action
    if (status === APPROVAL_STATUS.ACTIVE) action = '승인'
    else if (status === APPROVAL_STATUS.CANCEL) action = '반려'
    else action = '취소'

    const actionHtml = `
        <h2 style="color: #007bff; text-align:center;">지출 결재 ${action} 안내</h2>
        <p style="color:#333;">안녕하세요, <strong>${approval.name}</strong>님.</p>
        <p style="color:#333;">귀하의 지출 신청이 <strong>${action}</strong>되었습니다.</p>
    `

    const tableHtml = `
        <tr><td style="padding:8px; font-weight:600;">부서</td><td>${approval.department}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">이름</td><td>${approval.name}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">사용일</td><td>${approval.start}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">사용내용</td><td>${approval.reason}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">사용금액</td><td>${approval.etc}</td></tr>
    `
    const html = renderBaseTemplate(actionHtml, tableHtml)

    try {
        const transport = makeTransport()
        await transport.sendMail({
            from: `ACCOUNTING_MANAGER <${process.env.ACCOUNT_EMAIL}>`,
            to: approval.email,
            subject: `[결재 ${action}] ${approval.department}팀 ${approval.name} - ${approval.reason} (${approval.start})`,
            html,
        })
    } catch (err) {
        logger.error(err.stack || err)
    }
}