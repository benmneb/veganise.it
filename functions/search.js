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

	const [, term] = path.split('search/');

	if (!term) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				success: false,
				message: 'Invalid request, please check there is a valid "term"',
				params: { term },
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
		// { $addFields: { score: { $meta: 'searchScore' } } },
		{
			$facet: {
				results: [{ $limit: 20 }],
				totalCount: [{ $count: 'count' }],
			},
		},
	];

	try {
		const db = (await clientPromise).db(process.env.MONGO_DB);
		const recipes = db.collection(process.env.MONGO_COLLECTION);

		const response = await recipes.aggregate(pipeline).toArray();
		const results = response[0].results;
		const totalCount = response[0].totalCount[0]?.count || 0;

		return {
			statusCode: 200,
			body: JSON.stringify({ success: true, totalCount, results }),
		};
	} catch ({ message }) {
		console.error('While searching for recipes:', message);

		return {
			statusCode: 500,
			body: JSON.stringify({ success: false, message }),
		};
	}
}

module.exports = { handler };
