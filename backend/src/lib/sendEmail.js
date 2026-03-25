import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // Shortcut for Gmail settings
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Chattify Support" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            // If you want to send a link, make sure 'options.message' contains the URL
            text: options.message, 
            html: options.html,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully via Gmail!");
    } catch (error) {
        console.error("❌ Gmail SMTP Error:", error.message);
        throw new Error("Failed to send email");
    }
};