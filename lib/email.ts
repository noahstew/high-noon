import nodemailer from 'nodemailer';

/**
 * Email configuration using Nodemailer with Gmail SMTP (free)
 *
 * Setup instructions:
 * 1. Create a Gmail account or use existing
 * 2. Enable 2-factor authentication
 * 3. Generate an App Password: https://myaccount.google.com/apppasswords
 * 4. Add to .env.local:
 *    EMAIL_USER=your-email@gmail.com
 *    EMAIL_PASSWORD=your-app-password
 *    EMAIL_TO=recipient@example.com
 *
 * Alternative free SMTP providers:
 * - Gmail: smtp.gmail.com:587
 * - Outlook: smtp-mail.outlook.com:587
 * - Yahoo: smtp.mail.yahoo.com:587
 */

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

/**
 * Create and configure SMTP transporter
 */
function createTransporter() {
  // Validate environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Email credentials not configured. Check .env.local file.');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Connection timeout
    connectionTimeout: 10000,
  });
}

/**
 * Send email with optional PDF attachment
 * @param options - Email configuration options
 * @returns Promise that resolves when email is sent
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  const transporter = createTransporter();

  try {
    const info = await transporter.sendMail(options);
    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
}

/**
 * Send application PDF via email
 * @param file - File object containing PDF data
 * @param applicantName - Name of applicant (optional)
 * @param applicantEmail - Email of applicant (optional)
 */
export async function sendApplicationEmail(
  file: Buffer,
  filename: string,
  applicantName?: string,
  applicantEmail?: string
): Promise<void> {
  const recipientEmail = process.env.EMAIL_TO;

  if (!recipientEmail) {
    throw new Error(
      'Recipient email not configured. Set EMAIL_TO in .env.local'
    );
  }

  const applicantInfo =
    applicantName || applicantEmail
      ? `\n\nApplicant Information:\nName: ${
          applicantName || 'Not provided'
        }\nEmail: ${applicantEmail || 'Not provided'}`
      : '';

  const emailOptions: EmailOptions = {
    from: process.env.EMAIL_USER!,
    to: recipientEmail,
    subject: 'New Sponsorship Request - High Noon Optimist Club',
    text: `A new sponsorship request has been submitted.${applicantInfo}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0033a0;">New Sponsorship Request</h2>
        <p>A new sponsorship request has been submitted to High Noon Optimist Club.</p>
        ${
          applicantName || applicantEmail
            ? `
          <div style="background-color: #f0e4b2; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #231f20;">Requester Information</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${
              applicantName || 'Not provided'
            }</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${
              applicantEmail || 'Not provided'
            }</p>
          </div>
        `
            : ''
        }
        <p>Please see the attached PDF for the complete sponsorship request.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This email was sent from the High Noon Optimist Club website sponsorship request form.
        </p>
      </div>
    `,
    attachments: [
      {
        filename: filename,
        content: file,
        contentType: 'application/pdf',
      },
    ],
  };

  await sendEmail(emailOptions);
}
