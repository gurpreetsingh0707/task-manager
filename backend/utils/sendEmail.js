const nodemailer = require('nodemailer');

/**
 * Send email utility
 * @param {Object} options
 * @param {string} options.to      - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html    - HTML body
 */
const sendEmail = async ({ to, subject, html }) => {
    // Gmail SMTP use kar raha hai
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,  // tera gmail
            pass: process.env.EMAIL_PASS,  // Gmail App Password
        },
    });

    const mailOptions = {
        from: `"ProjectHub" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
};

module.exports = sendEmail;