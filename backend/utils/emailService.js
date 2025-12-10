const nodemailer = require('nodemailer');

// Check if email service is configured
const isEmailConfigured = () => {
    const hasEmailUser = process.env.EMAIL_USER && process.env.EMAIL_USER.trim() !== '';
    const hasEmailPassword = process.env.EMAIL_PASSWORD && process.env.EMAIL_PASSWORD.trim() !== '';
    return hasEmailUser && hasEmailPassword;
};

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
    if (!isEmailConfigured()) {
        throw new Error('Email service is not configured. Please set EMAIL_USER and EMAIL_PASSWORD environment variables.');
    }

    const emailService = process.env.EMAIL_SERVICE || 'gmail';

    // Mailgun uses SMTP
    if (emailService.toLowerCase() === 'mailgun') {
        return nodemailer.createTransport({
            host: process.env.MAILGUN_SMTP_HOST || 'smtp.mailgun.org',
            port: parseInt(process.env.MAILGUN_SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    // Gmail - use port 465 (SSL) for better compatibility with Render
    if (emailService.toLowerCase() === 'gmail') {
        return nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    // Other services
    return nodemailer.createTransport({
        service: emailService,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

// Send verification email
const sendVerificationEmail = async (email, name, verificationToken) => {
    try {
        // Check if email service is configured
        if (!isEmailConfigured()) {
            console.warn('⚠️ Email service not configured. Skipping verification email.');
            return {
                success: false,
                error: 'EMAIL_NOT_CONFIGURED',
                message: 'Email service is not configured'
            };
        }

        const transporter = createTransporter();
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

        const mailOptions = {
            from: `"Student Network" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email - Student Network',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                            border-radius: 10px 10px 0 0;
                        }
                        .content {
                            background: #f9f9f9;
                            padding: 30px;
                            border-radius: 0 0 10px 10px;
                        }
                        .button {
                            display: inline-block;
                            padding: 12px 30px;
                            background: #667eea;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to Student Network!</h1>
                        </div>
                        <div class="content">
                            <p>Hi ${name},</p>
                            <p>Thank you for registering with Student Network. Please verify your email address to complete your registration.</p>
                            <p style="text-align: center;">
                                <a href="${verificationUrl}" class="button">Verify Email Address</a>
                            </p>
                            <p>Or copy and paste this link in your browser:</p>
                            <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
                            <p>This link will expire in 24 hours.</p>
                            <p>If you didn't create an account, please ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Student Network. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Verification email sent successfully to:', email);

        return {
            success: true,
            message: 'Verification email sent successfully'
        };
    } catch (error) {
        console.error('❌ Error sending verification email:', error);
        return {
            success: false,
            error: 'EMAIL_SEND_FAILED',
            message: error.message
        };
    }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, resetToken) => {
    try {
        if (!isEmailConfigured()) {
            console.warn('⚠️ Email service not configured. Skipping password reset email.');
            return {
                success: false,
                error: 'EMAIL_NOT_CONFIGURED',
                message: 'Email service is not configured'
            };
        }

        const transporter = createTransporter();
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: `"Student Network" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request - Student Network',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                            border-radius: 10px 10px 0 0;
                        }
                        .content {
                            background: #f9f9f9;
                            padding: 30px;
                            border-radius: 0 0 10px 10px;
                        }
                        .button {
                            display: inline-block;
                            padding: 12px 30px;
                            background: #667eea;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <p>Hi ${name},</p>
                            <p>We received a request to reset your password. Click the button below to reset it:</p>
                            <p style="text-align: center;">
                                <a href="${resetUrl}" class="button">Reset Password</a>
                            </p>
                            <p>Or copy and paste this link in your browser:</p>
                            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
                            <p>This link will expire in 1 hour.</p>
                            <p>If you didn't request a password reset, please ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Student Network. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Password reset email sent successfully to:', email);

        return {
            success: true,
            message: 'Password reset email sent successfully'
        };
    } catch (error) {
        console.error('❌ Error sending password reset email:', error);
        return {
            success: false,
            error: 'EMAIL_SEND_FAILED',
            message: error.message
        };
    }
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    isEmailConfigured,
};
