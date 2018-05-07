const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const generateHTML = (filename = 'password-reset', options = {}) => {
    const html = pug.render(`${__dirname}/../views/email/${filename}.pug`, options);
    // inline css with juice
    const inlined = juice(html)
    return inlined;
};

exports.send = async (options) => {
    const { filename, user: { email }, subject } = options;
    const html = generateHTML(filename, options);
    const text = htmlToText.fromString(html);
    const mailOptions = {
        from: 'Rise And Fall <rise-and-fall@gmail.com>',
        to: email,
        subject,
        html,
        text,
    };
    const sendMail = promisify(transport.sendMail, transport);
    return sendMail(mailOptions);
};
