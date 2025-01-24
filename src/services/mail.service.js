import nodemailer from "nodemailer";
import { EMAIL_PASSWORD, EMAIL_USER_ID, SENDER_ID, SMS_API_KEY, SMS_GATEWAY_URL } from "../config/index.js";
import { ERROR_SENDING_OTP } from "../api/constants/errorCodes.js";
import AppError from "../utils/appError.js";

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
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
        <p>Thank you,<br>Team Fit & Muscles</p>
        <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
        <footer style="font-size: 12px; color: #888;">
          <p>This is an automated email, please do not reply.</p>
          <p>&copy; 2024 Fit & Muscles. All rights reserved.</p>
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

    // Configure the SMS gateway API
    const smsGatewayUrl = SMS_GATEWAY_URL; // SMS gateway URL
    const smsApiKey = SMS_API_KEY; // Your API key
    const senderId = SENDER_ID; // Sender ID (e.g., your brand or app name)

    // Define the SMS message
    const smsMessage = `Your OTP is: ${otpString}. It is valid for 10 minutes.`;

    // Prepare the payload for the API request
    const payload = {
      api_key: smsApiKey, // Correct API key field
      type: "text", // Set the message type to "text"
      contacts: `+971${phoneNumber}`, // Recipient phone number
      senderid: senderId, // Sender ID
      msg: smsMessage, // Message content
    };

    // Send OTP via SMS
    try {
      const response = await fetch(smsGatewayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is JSON or plain text
      const contentType = response.headers.get("content-type");
      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json(); // Parse as JSON
      } else {
        result = await response.text(); // Parse as plain text
      }

      if (response.ok) {
        console.log("SMS sent successfully:", result);
        return result;
      } else {
        throw new AppError("ERROR_SENDING_OTP", `Failed to send SMS: ${result}`, 400);
      }
    } catch (error) {
      throw new AppError(ERROR_SENDING_OTP, "Error sending SMS", 400);
    }
  }

  async sendOrderPlacedMail(email, orderDetails) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #4CAF50;">Order Confirmation</h2>
        <p>Dear Customer,</p>
        <p>Thank you for shopping with us! Your order has been placed successfully. Below are the details of your order:</p>
        <div style="border: 1px solid #ddd; padding: 10px; margin: 20px 0; background: #f9f9f9;">
          <h3 style="color: #333;">Order Summary</h3>
          <p><strong>Order Number:</strong> ${orderDetails.orderNumber}</p>
          <p><strong>Order Date:</strong> ${orderDetails.orderDate}</p>
          <p><strong>Total Amount:</strong> AED ${orderDetails.totalAmount}</p>
        </div>
        <p>Your order is currently <strong>pending confirmation</strong>. Once it is confirmed, we will notify you via email.</p>
        <p>Feel free to reach out to us if you have any questions regarding your order.</p>
        <p>Thank you for choosing Fit & Muscles!</p>
        <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
        <footer style="font-size: 12px; color: #888;">
          <p>This is an automated email, please do not reply.</p>
          <p>&copy; 2024 Fit & Muscles. All rights reserved.</p>
        </footer>
      </div>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: `${EMAIL_USER_ID}`, // Sender address
      to: email, // Recipient address
      subject: "Your Order Has Been Placed!", // Subject line
      text: `Your order is currently pending confirmation. We will notify you once it has been confirmed.`, // Plain text body
      html: htmlContent, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
  }
}

export default MailService;
