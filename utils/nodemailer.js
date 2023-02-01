const nodemailer = require('nodemailer');
const userMail = process.env.MAIL_USER;
const passwordMail = process.env.MAIL_PASSWORD;

const sendEmail = async (subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: userMail, // generated ethereal user
                pass: passwordMail, // generated ethereal password
            },
        });

        await transporter.sendMail({
            from: userMail,
            to: userMail,
            subject,
            text,
        });

        console.log('Email sended');
    } catch (error) {
        console.log(error, 'Email not sended');
    }
};

module.exports = sendEmail;
