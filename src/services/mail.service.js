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
  constructor() { }

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
      contacts: phoneNumber, // Recipient phone number
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

  async sendOrderConfirmationMail(email, orderDetails) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #4CAF50;">Order Confirmed 🎉</h2>
        <p>Dear Customer,</p>
        <p>We are excited to inform you that your order has been confirmed! Below are the details of your order:</p>
        <div style="border: 1px solid #ddd; padding: 10px; margin: 20px 0; background: #f9f9f9;">
          <h3 style="color: #333;">Order Summary</h3>
          <p><strong>Order Number:</strong> ${orderDetails.orderNumber}</p>
          <p><strong>Order Date:</strong> ${orderDetails.orderDate}</p>
          <p><strong>Total Amount:</strong> AED ${orderDetails.totalAmount}</p>
          <p><strong>Invoice Number:</strong> ${orderDetails.invoiceNo}</p>
        </div>
        <p>Your order is now being processed and will be dispatched soon. We will provide tracking details once your order is shipped.</p>
        <p>Thank you for shopping with us! If you have any questions, feel free to contact our support team.</p>
        <p>We appreciate your trust in Fit & Muscles! 💪</p>
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
      subject: "Your Order Has Been Confirmed! ✅", // Subject line
      text: `Your order has been confirmed. Invoice No: ${orderDetails.invoiceNo}. We will notify you once it has been shipped.`, // Plain text body
      html: htmlContent, // HTML body
    });

    console.log("Order Confirmation Mail sent: %s", info.messageId);
  }

  async sendLoginCredentialsSms(phoneNumber, email, password) {
    // Configure the SMS gateway API
    const smsGatewayUrl = SMS_GATEWAY_URL; // SMS gateway URL
    const smsApiKey = SMS_API_KEY; // Your API key
    const senderId = SENDER_ID; // Sender ID (e.g., your brand or app name)

    // Define the SMS message
    const smsMessage = `Your login credentials:\nEmail: ${email}\nPassword: ${password}\nPlease keep them safe.`;

    // Prepare the payload for the API request
    const payload = {
      api_key: smsApiKey, // Correct API key field
      type: "text", // Set the message type to "text"
      contacts: phoneNumber, // Recipient phone number
      senderid: senderId, // Sender ID
      msg: smsMessage, // Message content
    };

    // Send SMS
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
        throw new AppError("ERROR_SENDING_SMS", `Failed to send SMS: ${result}`, 400);
      }
    } catch (error) {
      throw new AppError("ERROR_SENDING_SMS", "Error sending SMS", 400);
    }
  }

  async sendReturnRejectMail({ email, name, quantity, price, reason }) {

    // Email content for rejected return request
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #d9534f;">Return Request Rejected</h2>
        <p>Dear Customer,</p>
        <p>We regret to inform you that your return request has been rejected for the following reason:</p>
        <div style="background: #f8d7da; padding: 10px; border-radius: 5px; margin: 10px 0;">
          <strong>Reason:</strong> ${reason}
        </div>
        <p>Product Details:</p>
        <div style="background: #f3f3f3; padding: 10px; border-radius: 5px; margin: 10px 0;">
          <strong>Product Name:</strong> ${name || "N/A"} <br>
          <strong>Quantity:</strong> ${quantity || "N/A"} <br>
          <strong>Price:</strong> AED ${price || "N/A"}
        </div>
        <p>If you have any concerns, please contact our support team.</p>
        <p>Thank you,<br>Team Fit & Muscles</p>
        <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
        <footer style="font-size: 12px; color: #888;">
          <p>This is an automated email, please do not reply.</p>
          <p>&copy; 2024 Fit & Muscles. All rights reserved.</p>
        </footer>
      </div>
    `;

    await transporter.sendMail({
      from: `${EMAIL_USER_ID}`,
      to: email,
      subject: "Return Request Rejected",
      text: `Your return request for ${name || "N/A"} has been rejected. Reason: ${reason}`,
      html: htmlContent,
    });

    console.log("Message sent: %s");

  }

  async sendReturnAcceptMail({ email, name, quantity, price }) {
    // Email content for accepted return request
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #28a745;">Return Request Accepted</h2>
        <p>Dear Customer,</p>
        <p>We are pleased to inform you that your return request has been <strong>approved</strong>.</p>
        
        <p><strong>Product Details:</strong></p>
        <div style="background: #f3f3f3; padding: 10px; border-radius: 5px; margin: 10px 0;">
          <strong>Product Name:</strong> ${name || "N/A"} <br>
          <strong>Quantity:</strong> ${quantity || "N/A"} <br>
          <strong>Refund Amount:</strong> AED ${price || "N/A"}
        </div>
  
        <p>Our team will process the return as per our return policy. If you have any further queries, feel free to contact our support team.</p>
        <p>Thank you,<br>Team Fit & Muscles</p>
        
        <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
        <footer style="font-size: 12px; color: #888;">
          <p>This is an automated email, please do not reply.</p>
          <p>&copy; 2024 Fit & Muscles. All rights reserved.</p>
        </footer>
      </div>
    `;

    await transporter.sendMail({
      from: `${EMAIL_USER_ID}`,
      to: email,
      subject: "Return Request Approved",
      text: `Your return request for ${name || "N/A"} has been approved. Refund Amount: AED ${price || "N/A"}.`,
      html: htmlContent,
    });

    console.log("Return approval email sent successfully.");
  }

  async sendSupportResponseMail({ email, ticketId, message, reason }) {
    // Define the HTML structure of the email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #007bff;">Support Request Update</h2>
        <p>Dear User,</p>
        <p>We have reviewed your support request (Ticket ID: <strong>#${ticketId}</strong>).</p>
        
        <p><strong>Your Query:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #007bff;">
          ${message}
        </blockquote>
  
        <p><strong>Our Response:</strong></p>
        <blockquote style="background: #e8f4fc; padding: 10px; border-left: 4px solid #28a745;">
          ${reason}
        </blockquote>
  
        <p>If you need further assistance, feel free to reply to this email.</p>
        <p>Thank you for reaching out to us.</p>
        
        <p>Best Regards,<br>Support Team</p>
        <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
        <footer style="font-size: 12px; color: #888;">
          <p>This is an automated email, please do not reply.</p>
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </footer>
      </div>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: `${EMAIL_USER_ID}`, // Sender address
      to: email, // Recipient address
      subject: `Support Request Update - OrderId #${ticketId}`, // Subject line
      text: `Dear User, we have reviewed your support request (Ticket ID: #${ticketId}).\n\nYour Query:\n${message}\n\nOur Response:\n${reason}\n\nBest Regards,\nSupport Team`, // Plain text fallback
      html: htmlContent, // HTML body
    });

    console.log("Support response email sent: %s", info.messageId);
  }

}

export default MailService;
