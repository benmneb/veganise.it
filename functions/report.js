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

	const { reason, email, recipe } = JSON.parse(body);

	if (!reason || !email || !recipe) {
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
			subject: '🧑‍🍳 Veganise It! Recipe was reported',
			html: `<p>Reason: ${reason}</p>
      <p>Contact: <a href="mailto:${email}">${email}</a></p>
      <p>Recipe: <pre>${JSON.stringify(recipe, null, 2)}</pre></p>`,
		});

		return {
			statusCode: 200,
			body: JSON.stringify({ success: true }),
		};
	} catch ({ message }) {
		console.error('While reporting recipe:', message);
		return {
			statusCode: 500,
			body: JSON.stringify({ success: false, message }),
		};
	}
}

module.exports = { handler };
