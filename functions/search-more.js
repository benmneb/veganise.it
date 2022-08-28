require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

const clientPromise = client.connect();

async function handler({ path, httpMethod }) {
	if (httpMethod !== 'GET') {
		return {
			statusCode: 405,
			headers: {
				Allow: 'GET',
			},
		};
	}

	const [term, offset] = path.split('search-more/')[1].split('/');

	if (!term || !offset) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				success: false,
				message: 'Invalid request, please check params',
				params: { term, offset },
			}),
		};
	}

	const pipeline = [
		{
			$search: {
				index: 'search',
				text: {
					query: decodeURIComponent(term),
					path: { wildcard: '*' },
					synonyms: 'synonyms',
				},
			},
		},
		{ $skip: Number(offset) },
		{ $limit: 20 },
	];

	try {
		const db = (await clientPromise).db(process.env.MONGO_DB);
		const recipes = db.collection(process.env.MONGO_COLLECTION);
		const results = await recipes.aggregate(pipeline).toArray();

		return {
			statusCode: 200,
			body: JSON.stringify({ success: true, results }),
		};
	} catch ({ message }) {
		console.error('While searching for more:', message);
		return {
			statusCode: 500,
			body: JSON.stringify({ success: false, message }),
		};
	}
}

module.exports = { handler };
