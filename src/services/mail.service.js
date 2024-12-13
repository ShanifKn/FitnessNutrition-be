import nodemailer from "nodemailer";
import { EMAIL_PASSWORD, EMAIL_USER_ID } from "../config/index.js";

const transporter = nodemailer.createTransport({
  host: "mail.fitnmuscles.com",
  port: 587,
  auth: {
    user: EMAIL_USER_ID,
    pass: EMAIL_PASSWORD,
  },
});

class MailService {
  constructor() {}

  async SendOtpMail(email, otp) {
    const otpString = otp.toString();

    // Send the email
    const info = await transporter.sendMail({
      from: EMAIL_USER_ID, // Sender address
      to: email, // Recipient address
      subject: "Your OTP Code", // Subject line
      text: `Your OTP is: ${otpString}`, // Plain text body
      html: `<p>Your OTP is: <b>${otpString}</b></p>`, // HTML body
    });

    // Send the email
    console.log("Message sent: %s", info.messageId);
  }
}

export default MailService;
