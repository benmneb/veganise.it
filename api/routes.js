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
		} catch ({ message }) {
			res.status(500).json({ success: false, message });
			console.error('While getting all recipes:', message);
		}
	});

	app.get('/recipe/:id', async (req, res) => {
		const id = req.params.id;

		if (!id) {
			return res.status(500).json({
				success: false,
				message: `ID was ${id}`,
			});
		}

		try {
			const data = await recipes.findOne(ObjectId(id));
			if (!data) throw new Error('Please check ID');
			res.status(200).json({ success: true, data });
		} catch ({ message }) {
			res.status(200).json({ success: false, message });
		}
	});

	app.get('/search/:term', async (req, res) => {
		const term = req.params.term;

		if (!term) {
			return res
				.status(500)
				.json({ success: false, message: `Term was ${term}` });
		}

		const pipeline = [
			{
				$search: {
					index: 'search',
					text: {
						query: term,
						path: { wildcard: '*' },
						synonyms: 'synonyms',
					},
				},
			},
			// { $addFields: { score: { $meta: 'searchScore' } } },
			{
				$facet: {
					results: [{ $limit: 20 }],
					totalCount: [{ $count: 'count' }],
				},
			},
		];

		try {
			const response = await recipes.aggregate(pipeline).toArray();
			const results = response[0].results;
			const totalCount = response[0].totalCount[0]?.count || 0;

			res.status(200).json({ success: true, totalCount, results });
		} catch ({ message }) {
			res.status(500).json({ success: false, message });
			console.error('While searching:', message);
		}
	});

	app.get('/search-more/:term/:offset', async (req, res) => {
		const { term, offset } = req.params;

		if (!term) {
			return res
				.status(500)
				.json({ success: false, message: `Term was ${term}` });
		}

		if (!offset) {
			return res
				.status(500)
				.json({ success: false, message: `Offset was ${offset}` });
		}

		const pipeline = [
			{
				$search: {
					index: 'search',
					text: {
						query: term,
						path: { wildcard: '*' },
						synonyms: 'synonyms',
					},
				},
			},
			{ $skip: Number(offset) },
			{ $limit: 20 },
		];

		try {
			const results = await recipes.aggregate(pipeline).toArray();
			res.status(200).json({ success: true, results });
		} catch ({ message }) {
			res.status(500).json({ success: false, message });
			console.error('While searching for more:', message);
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
		} catch ({ message }) {
			res.status(500).json({ success: false, message });
			console.error('While liking recipe:', message);
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
				to: process.env.VEGANISE_IT_CONTACT,
				subject: '🧑‍🍳 Veganise It! New Recipe Submission',
				html: `Someone suggested: ${url}`,
			});
			res.status(200).json({ success: true });
		} catch ({ message }) {
			res.status(500).json({ success: false, message });
			console.error('While submitting recipes:', message);
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
				to: process.env.VEGANISE_IT_CONTACT,
				subject: '🧑‍🍳 Veganise It! New Potential Advertiser',
				html: `Get in contact with: <a href="mailto:${email}">${email}</a>`,
			});
			res.status(200).json({ success: true });
		} catch ({ message }) {
			res.status(500).json({ success: false, message });
			console.error('While submitting advertising request:', message);
		}
	});

	app.post('/report', async (req, res) => {
		const { reason, email, recipe } = req.body;

		if (!reason || !email || !recipe) {
			return res
				.status(500)
				.json({
					success: false,
					message: `Reason was ${reason}. Email was ${email}. Recipe was ${recipe}`,
				});
		}

		try {
			await transporter.sendMail({
				from: process.env.GMAIL_USER,
				to: process.env.VEGANISE_IT_CONTACT,
				subject: '🧑‍🍳 Veganise It! Recipe was reported',
				html: `<p>Reason: ${reason}</p>
				<p>Contact: <a href="mailto:${email}">${email}</a></p>
				<p>Recipe: <pre>${JSON.stringify(recipe, null, 2)}</pre></p>`,
			});
			res.status(200).json({ success: true });
		} catch ({ message }) {
			res.status(500).json({ success: false, message });
			console.error('While reporting recipe:', message);
		}
	});

	return app;
}
