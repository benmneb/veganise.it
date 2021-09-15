import { ObjectId } from 'mongodb';

import { transporter } from './transporter.js';

export default function routes(app, db) {
	const recipes = db.collection('recipes');

	app.get('/', (_, res) => {
		res.send('Get off my lawn! 👴🏻');
	});

	app.get('/all-recipes', async (_, res) => {
		try {
			const response = await recipes.find().toArray();
			res.status(200).json(response);
		} catch (error) {
			res.status(500).json({ 'Error getting all recipes': error.message });
			console.error('While getting all recipes:', error);
		}
	});

	app.get('/recipe/:id', async (req, res) => {
		const id = req.params.id;

		if (!id) {
			return res.status(500).json({
				success: 'false',
				message: `ID was ${id}`,
			});
		}

		try {
			const response = await recipes.findOne(ObjectId(id));
			res.status(200).json({ success: true, data: response });
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
			console.error('Error getting recipe by ID:', error.message);
		}
	});

	app.get('/search/:term', async (req, res) => {
		const term = req.params.term;

		if (!term) {
			return res
				.status(500)
				.json({ success: false, message: `Term was ${term}` });
		}

		try {
			const response = await recipes
				.find({ $text: { $search: term } })
				.toArray();
			res
				.status(200)
				.json({ success: true, length: response.length, data: response });
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
			console.error('While searching:', error.message);
		}
	});

	app.post('/like', async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return res
				.status(500)
				.json({ success: false, message: `Recipe ID was ${id}` });
		}

		try {
			const response = await recipes.findOneAndUpdate(
				{ _id: ObjectId(id) },
				{ $inc: { likes: 1 } },
				{ returnDocument: 'after' }
			);
			res
				.status(200)
				.json({ success: true, data: { likes: response.value.likes } });
		} catch (error) {
			res.status(500).json({ 'Error liking recipe': error.message });
			console.error('Error liking recipe:', error);
		}
	});

	app.post('/submit', async (req, res) => {
		const { url } = req.body;

		if (!url) {
			return res
				.status(500)
				.json({ success: false, message: `URL was ${url}` });
		}

		try {
			await transporter.sendMail({
				from: process.env.GMAIL_USER,
				to: process.env.GMAIL_USER,
				subject: '🧑‍🍳 Veganise It! New Recipe Submission',
				html: `Someone suggested: ${url}`,
			});
			res.status(200).json({ success: true });
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
			console.error('Error submitting recipes:', error);
		}
	});

	app.post('/advertise', async (req, res) => {
		const { email } = req.body;

		if (!email) {
			return res
				.status(500)
				.json({ success: false, message: `Email was ${email}` });
		}

		try {
			await transporter.sendMail({
				from: process.env.GMAIL_USER,
				to: process.env.GMAIL_USER,
				subject: '🧑‍🍳 Veganise It! New Potential Advertiser',
				html: `Get in contact with: <a href="mailto:${email}">${email}</a>`,
			});
			res.status(200).json({ success: true });
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
			console.error('Error submitting advertising request:', error);
		}
	});

	return app;
}
