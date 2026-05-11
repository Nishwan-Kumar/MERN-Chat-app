import SibApiV3Sdk from "sib-api-v3-sdk";

export const sendEmail = async (options) => {
    try {
        
        const client = SibApiV3Sdk.ApiClient.instance;
        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

        const mailOptions = {
            sender: {
                email: process.env.EMAIL_FROM, // must be verified in Brevo
                name: "Chattify Support",
            },
            to: [{ email: options.email }],
            subject: options.subject,
            textContent: options.message,
            htmlContent: options.html,
        };

        const info = await emailApi.sendTransacEmail(mailOptions);

        console.log("✅ Email sent successfully:", info.messageId || info);
        return info;

    } catch (error) {
        console.error("❌ Brevo API Error:", error.response?.body || error.message);
        throw new Error("Failed to send email");
    }
};