require('dotenv').config();
const nodemailer = require('nodemailer');

const { EMAIL_SERVICE, FROM_EMAIL, APP_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
	service: EMAIL_SERVICE,
	auth: {
		user: FROM_EMAIL,
		pass: APP_PASSWORD,
	},
});

module.exports = { transporter };
