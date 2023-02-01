const pgp = require('../utils/pgp');
const sendEmail = require('../utils/nodemailer');

const emailController = {};

emailController.contactForm = async (req, res, next) => {
    const { email, message } = req.body;
    const encrypted = await pgp.encrypt(message);

    // const decrypted = await pgp.decrypt(encrypted);

    try {
        sendEmail(email, encrypted);

        const data = new Emails({ email, message: encrypted });
        await data.save();
    } catch (error) {
        const err = {
            name: 'Contact form error',
            status: 501,
            message: 'Error sending or saving message from contact form',
            error,
        };
        return next(err);
    }

    res.send({ message: encrypted });
};

module.exports = emailController;
