require('dotenv').config();
const { transporter } = require('./services/transporter.js');

async function handler({ body, httpMethod }) {
	if (httpMethod !== 'POST') {
		return {
			statusCode: 405,
			headers: {
				Allow: 'POST',
			},
		};
	}

	const { message, email } = JSON.parse(body);

	if (!message || !email) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				success: false,
				message: 'Invalid request, please check request body',
				body: JSON.parse(body),
			}),
		};
	}

	try {
		await transporter.sendMail({
			from: process.env.FROM_EMAIL,
			to: process.env.TO_EMAIL,
			subject: '🧑‍🍳 Veganise It! New contact message',
			html: `<p>${message}</p>
      <p>From: <a href="mailto:${email}">${email}</a></p>`,
		});

		return {
			statusCode: 200,
			body: JSON.stringify({ success: true }),
		};
	} catch ({ message }) {
		console.error('While submitting contact:', message);
		return {
			statusCode: 500,
			body: JSON.stringify({ success: false, message }),
		};
	}
}

module.exports = { handler };
