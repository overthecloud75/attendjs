// 📎 공통 링크/푸터
export const renderFooterLink = (linkText = '📋 SmartWork 바로가기') => `
    <div style="text-align:center; margin-top:24px;">
        <a href="${process.env.DOMAIN}" 
           style="background-color:#007bff; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-size:14px;">
           ${linkText}
        </a>
    </div>
    <p style="text-align:center; margin-top:32px; font-size:13px; color:#aaa;">
        © ${new Date().getFullYear()} SmartWork. All rights reserved.
    </p>
`

// 📨 간단 메시지용 템플릿
export const renderSimpleMessage = (title, message, linkText = '홈으로 돌아가기') => `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 40px auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fafafa; text-align: center;">
        <h2 style="color: #333;">${title}</h2>
        <p style="color: #666; line-height: 1.6;">${message}</p>
        ${renderFooterLink(linkText)}
    </div>
`

// 🔐 인증 메일 템플릿
export const renderAuthTemplate = (title, name, bodyHtml) => `
    <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, sans-serif; background-color: #f4f6f8; padding: 24px; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">

            <!-- 헤더 -->
            <div style="background-color: #2563eb; color: white; padding: 16px 24px;">
                <h1 style="margin: 0; font-size: 20px;">SmartWork ${title}</h1>
            </div>

            <!-- 본문 -->
            <div style="padding: 24px;">
                <h2 style="margin-top: 0;">안녕하세요, ${name}님</h2>
                ${bodyHtml}
            </div>

            ${renderFooterLink()}
        </div>
    </div>

    <!-- 반응형 -->
    <style>
        @media only screen and (max-width: 600px) {
            div[style*="max-width: 600px"] {
                width: 100% !important;
                border-radius: 0 !important;
            }
            h1, h2, h3, p {
                text-align: center !important;
            }
            div[style*="padding: 24px"] {
                padding: 16px !important;
            }
        }
    </style>
`

// 📝 승인/반려 요청 메일 템플릿
export const renderRequestTemplate = (actionHtml = '', tableHtml = '', approveUrl = '', cancelUrl = '') => {
    const approveButtons = `
        <div style="text-align:center; margin-top:28px;">
            <a href="${approveUrl}" 
               style="background-color: #28a745; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-size:15px; margin-right:8px;">
               ✅ 승인
            </a>
            <a href="${cancelUrl}" 
               style="background-color: #dc3545; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-size:15px;">
               ❌ 반려
            </a>
        </div>
    `
    return renderBaseTemplate(actionHtml, tableHtml, approveButtons)
}


// 🧱 공통 Base 템플릿
export const renderBaseTemplate = (actionHtml = '', tableHtml = '', footerHtml = '') => `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e0e0e0; padding: 24px;">
        ${actionHtml}
        <table style="width:100%; border-collapse: collapse; margin-top:16px;">
            ${tableHtml}
        </table>
        ${footerHtml}
        ${renderFooterLink()}
    </div>
`