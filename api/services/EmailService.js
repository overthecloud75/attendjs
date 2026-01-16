
import { sendRegistrationConfirmationEmail, sendPasswordResetOtpEmail } from '../utils/email.js'

export default class EmailService {
    static sendRegistrationConfirmation(name, email, token) {
        return sendRegistrationConfirmationEmail(name, email, token)
    }

    static sendPasswordResetOtp(name, email, otp) {
        return sendPasswordResetOtpEmail(name, email, otp)
    }
}
