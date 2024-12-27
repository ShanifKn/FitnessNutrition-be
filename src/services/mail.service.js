import nodemailer from "nodemailer";
import { EMAIL_PASSWORD, EMAIL_USER_ID } from "../config/index.js";
import { ERROR_SENDING_OTP } from "../api/constants/errorCodes.js";

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

  async sendOtpMail(email, otp) {
    const otpString = otp.toString();

    // Define the HTML structure of the email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #4CAF50;">Your OTP Code</h2>
        <p>Dear User,</p>
        <p>We received a request for an action that requires verification. Use the following OTP to proceed:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #4CAF50;">${otpString}</span>
        </div>
        <p>If you did not request this, please ignore this email. The OTP is valid for 10 minutes.</p>
        <p>Thank you,<br>Team [Your Company Name]</p>
        <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
        <footer style="font-size: 12px; color: #888;">
          <p>This is an automated email, please do not reply.</p>
          <p>&copy; 2024 [Your Company Name]. All rights reserved.</p>
        </footer>
      </div>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: `${EMAIL_USER_ID}`, // Sender address
      to: email, // Recipient address
      subject: "Your OTP Code", // Subject line
      text: `Your OTP is: ${otpString}`, // Plain text body for fallback
      html: htmlContent, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
  }

  async sendOtpSms(phoneNumber, otp) {
    const otpString = otp.toString();

    // Configure your SMS gateway API
    const smsGatewayUrl = "https://api.yoursmsgateway.com/send"; // Replace with actual SMS gateway URL
    const smsApiKey = "YOUR_SMS_GATEWAY_API_KEY"; // Replace with actual API key

    // Define the SMS message
    const smsMessage = `Your OTP is: ${otpString}. It is valid for 10 minutes.`;

    // Send OTP via SMS
    try {
      const response = await fetch(smsGatewayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: smsApiKey,
          to: phoneNumber,
          message: smsMessage,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("SMS sent successfully:", result);
      } else {
        console.error("Failed to send SMS:", result);
      }
    } catch (error) {
      throw new AppError(ERROR_SENDING_OTP, "Error sending SMS", 400);
    }
  }
}

export default MailService;
