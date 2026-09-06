import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'localhost';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '1025');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@eggdirect.local';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

export async function sendVerificationEmail(
  email: string,
  firstName: string,
  verificationLink: string
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Welcome to EggDirect, ${firstName}!</h2>
      <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
      <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
      <p>Or copy this link: ${verificationLink}</p>
      <p>This link expires in 24 hours.</p>
    </div>
  `;
  await sendEmail({
    to: email,
    subject: 'Verify your EggDirect email',
    html,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  firstName: string,
  resetLink: string
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Password Reset Request</h2>
      <p>Hi ${firstName},</p>
      <p>We received a request to reset your password. Click the link below to proceed:</p>
      <a href="${resetLink}" style="background-color: #008CBA; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>Or copy this link: ${resetLink}</p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;
  await sendEmail({
    to: email,
    subject: 'Reset your EggDirect password',
    html,
  });
}

export async function sendOrderConfirmationEmail(
  email: string,
  firstName: string,
  orderNumber: string,
  orderTotal: number
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Order Confirmed!</h2>
      <p>Hi ${firstName},</p>
      <p>Thank you for your order. Here are the details:</p>
      <p><strong>Order Number:</strong> ${orderNumber}</p>
      <p><strong>Total Amount:</strong> PKR ${orderTotal.toFixed(2)}</p>
      <p>You will receive updates about your order via email.</p>
    </div>
  `;
  await sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    html,
  });
}
