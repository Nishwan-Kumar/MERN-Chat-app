import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false, // 👈 Must be false for port 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            // 👈 Add these for Cloud stability
            connectionTimeout: 10000, 
            greetingTimeout: 10000,
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: `"Chattify Support" <${process.env.EMAIL_FROM}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html, 
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ SMTP Error:", error.message);
        throw new Error("Failed to send email");
    }
};