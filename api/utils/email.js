import nodemailer from 'nodemailer'

export const sendConfirmationEmail = async (name, email, confirmationCode) => {
    console.log('check send email')  

    try {
        const transport = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT, 
            auth: {
                user: process.env.ACCOUNT_EMAIL,
                pass: process.env.ACCOUNT_PASSWORD,
            },
            secureConnection: false,
            tls: { ciphers: 'SSLv3' }
        });
        await transport.sendMail({
            from: process.env.ACCOUNT_EMAIL,
            to: email,
            subject: '[SMART WORK] Please confirm your account',
            html: `<h2>Hello ${name}</h2>
                <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
                <a href=${process.env.DOMAIN}/confirm/${confirmationCode}> Click here</a>
                </div>`,
        })
    }
    catch(err) {console.log('err', err)}
}