import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// Create a singleton transporter instance
let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) {
    return transporter;
  }

  if (env.NODE_ENV === "production") {
    // In production, configure with real SMTP credentials from env
    // For now, we will throw an error or mock it if credentials aren't provided.
    // In a real scenario, you'd use SendGrid, SES, etc.
    console.warn("Production email provider not configured. Using fallback.");
    transporter = nodemailer.createTransport({
      host: "localhost",
      port: 1025,
      ignoreTLS: true,
    });
    return transporter;
  } else {
    // Generate a test account on Ethereal for local development
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return transporter;
  }
}

export const emailService = {
  async sendPasswordResetEmail(to: string, resetUrl: string) {
    const mailTransporter = await getTransporter();
    
    const info = await mailTransporter.sendMail({
      from: '"Hotel Booking Admin" <admin@hotelbooking.local>',
      to,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link to reset: ${resetUrl}`,
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <p><a href="${resetUrl}">${resetUrl}</a></p>
             <p>If you did not request this, please ignore this email.</p>`,
    });

    console.log("Message sent: %s", info.messageId);
    
    // Ethereal provides a preview URL
    if (env.NODE_ENV !== "production") {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("Preview URL: %s", previewUrl);
      return previewUrl;
    }
    
    return undefined;
  },
};
