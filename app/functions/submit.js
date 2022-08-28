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

	const { url } = JSON.parse(body);

	if (!url) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				success: false,
				message: 'Invalid request, please check request body includes a URL',
				body: JSON.parse(body),
			}),
		};
	}

	try {
		await transporter.sendMail({
			from: process.env.FROM_EMAIL,
			to: process.env.TO_EMAIL,
			subject: '🧑‍🍳 Veganise It! New Recipe Submission',
			html: `Someone suggested: ${url}`,
		});

		return {
			statusCode: 200,
			body: JSON.stringify({ success: true }),
		};
	} catch ({ message }) {
		console.error('While submitting recipes:', message);
		return {
			statusCode: 500,
			body: JSON.stringify({ success: false, message }),
		};
	}
}

module.exports = { handler };
