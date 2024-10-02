const { createTransport } = require("nodemailer");

class NodeEmailService {

    static CONFIGS = {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD_EMAIL,
        },
    };

    constructor() { }


    static async sendEmail(
        email,
        subject,
        bodyHtml,
    ) {
        const transporter = createTransport(this.CONFIGS);
        try {
            const response = await transporter.sendMail({
                from: "snapwireinfo@gmail.com",
                to: email,
                subject,
                html: bodyHtml,
            });
            console.log("Envia correo a", email);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = {
    NodeEmailService
}