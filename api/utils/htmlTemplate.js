// 📎 공통 링크/푸터
export const renderFooterLink = (linkText = '📋 SmartWork 바로가기') => `
    <div style="text-align:center; margin: 32px 0 16px;">
        <a href="${process.env.DOMAIN}" 
           style="background-color:#2563eb; color:white; padding:14px 28px; border-radius:10px; text-decoration:none; font-size:16px; font-weight: 600; display: inline-block;">
           ${linkText}
        </a>
    </div>
    <p style="text-align:center; margin-bottom: 24px; font-size:13px; color:#94a3b8; line-height: 1.5;">
        본 메일은 시스템에 의해 자동 발송되었습니다.<br>
        © ${new Date().getFullYear()} SmartWork. All rights reserved.
    </p>
`

// 📨 간단 메시지용 템플릿
export const renderSimpleMessage = (title, message, linkText = '홈으로 돌아가기') => `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { margin: 0; padding: 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .card { max-width: 480px; width: 100%; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); box-sizing: border-box; }
        h2 { color: #1e293b; margin-top: 0; font-size: 24px; font-weight: 700; }
        p { color: #475569; line-height: 1.6; font-size: 16px; margin: 16px 0 24px; }
        .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 16px; font-weight: 600; transition: background-color 0.2s; }
        .footer { margin-top: 32px; font-size: 14px; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="card">
        <h2>${title}</h2>
        <p>${message}</p>
        <a href="${process.env.DOMAIN}" class="btn">${linkText}</a>
        <div class="footer">© ${new Date().getFullYear()} SmartWork.</div>
    </div>
</body>
</html>
`

// 🔐 인증 메일 템플릿
export const renderAuthTemplate = (title, name, bodyHtml) => `
    <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, sans-serif; background-color: #f4f7fa; padding: 20px 10px; color: #334155;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-collapse: collapse;">
            <!-- 헤더 -->
            <tr>
                <td style="background-color: #2563eb; padding: 20px 24px;">
                    <h1 style="margin: 0; font-size: 20px; color: #ffffff; font-weight: 700;">SmartWork ${title}</h1>
                </td>
            </tr>
            <!-- 본문 -->
            <tr>
                <td style="padding: 32px 24px;">
                    <h2 style="margin: 0 0 20px; font-size: 22px; color: #1e293b;">안녕하세요, ${name}님</h2>
                    <div style="font-size: 16px; line-height: 1.6; color: #475569;">
                        ${bodyHtml}
                    </div>
                </td>
            </tr>
            <!-- 푸터 -->
            <tr>
                <td style="padding: 0 24px 24px;">
                    ${renderFooterLink()}
                </td>
            </tr>
        </table>
    </div>
`

// 📝 승인/반려 요청 메일 템플릿
export const renderRequestTemplate = (actionHtml = '', tableHtml = '', approveUrl = '', cancelUrl = '') => {
    const approveButtons = `
        <div style="margin-top: 32px; text-align: center;">
            <!--[if mso]>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${approveUrl}" style="height:48px;v-text-anchor:middle;width:120px;" arcsize="20%" stroke="f" fillcolor="#10b981">
                <w:anchorlock/>
                <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:bold;">승인</center>
            </v:roundrect>
            <![endif]-->
            <a href="${approveUrl}" 
               style="background-color: #10b981; color:#ffffff; padding:14px 32px; border-radius:10px; text-decoration:none; font-size:16px; font-weight:700; display: inline-block; margin: 5px; min-width: 120px;">
               ✅ 승인하기
            </a>
            
            <a href="${cancelUrl}" 
               style="background-color: #ef4444; color:#ffffff; padding:14px 32px; border-radius:10px; text-decoration:none; font-size:16px; font-weight:700; display: inline-block; margin: 5px; min-width: 120px;">
               ❌ 반려하기
            </a>
        </div>
        <p style="text-align: center; font-size: 13px; color: #94a3b8; margin-top: 16px;">
            버튼 클릭 시 별도의 로그인 없이 즉시 처리됩니다.
        </p>
        <style>
            @media only screen and (max-width: 480px) {
                .approve-buttons a {
                    display: block !important;
                    margin: 10px auto !important;
                    width: calc(100% - 20px) !important; /* Adjust for padding/margin */
                    max-width: 200px !important;
                }
            }
        </style>
    `
    return renderBaseTemplate(actionHtml, tableHtml, approveButtons)
}


// 🧱 공통 Base 템플릿
export const renderBaseTemplate = (actionHtml = '', tableHtml = '', footerHtml = '') => `
    <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, sans-serif; background-color: #f4f7fa; padding: 20px 10px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px; border-collapse: collapse;">
            <tr>
                <td style="padding: 24px;">
                    <div style="margin-bottom: 24px;">
                        ${actionHtml}
                    </div>
                    <table width="100%" style="border-collapse: collapse; background-color: #f8fafc; border-radius: 12px; overflow: hidden;">
                        ${tableHtml}
                    </table>
                    ${footerHtml}
                    ${renderFooterLink()}
                </td>
            </tr>
        </table>
        <style>
            @media only screen and (max-width: 600px) {
                table[style*="max-width: 600px"] {
                    width: 100% !important;
                    border-radius: 0 !important;
                    border-left: none !important;
                    border-right: none !important;
                }
                table[style*="max-width: 600px"] td {
                    padding: 16px !important;
                }
                table[style*="border-collapse: collapse; background-color: #f8fafc"] {
                    display: block !important;
                    width: 100% !important;
                    overflow-x: auto !important;
                    -webkit-overflow-scrolling: touch !important;
                }
                table[style*="border-collapse: collapse; background-color: #f8fafc"] tbody,
                table[style*="border-collapse: collapse; background-color: #f8fafc"] tr,
                table[style*="border-collapse: collapse; background-color: #f8fafc"] td {
                    display: block !important;
                    width: auto !important;
                }
                table[style*="border-collapse: collapse; background-color: #f8fafc"] td {
                    padding: 8px 12px !important;
                    border-bottom: 1px solid #e2e8f0 !important;
                }
                table[style*="border-collapse: collapse; background-color: #f8fafc"] tr:last-child td {
                    border-bottom: none !important;
                }
            }
        </style>
    </div>
`