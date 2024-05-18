import nodemailer from "nodemailer";
import logger from "./pino.js";
import htmlTemp from "../Template/emailTemplate.js";

async function sendEmail(options) {
  const htmlTemps = await htmlTemp(options);

  try {
    // Create a SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: options.email,
      subject: "OTP VERIFICATION",
      html: htmlTemps,
    });

    logger.info("Email sent successfully:", info.messageId);
    return {
      success: true,
      message: "Otp for verification sent successfully on your email",
    };
  } catch (err) {
    logger.error("Error sending email:", err);
    return {
      success: false,
      error: "An error occurred while sending the email",
    };
  }
}

export default sendEmail;
