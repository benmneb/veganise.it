require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

	const [, id] = path.split('recipe/');

	if (!id) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				success: false,
				message: 'Invalid request, please check there is a valid "id"',
				params: { id },
			}),
		};
	}

	try {
		const db = (await clientPromise).db(process.env.MONGO_DB);
		const recipes = db.collection(process.env.MONGO_COLLECTION);

		const data = await recipes.findOne(ObjectId(id));

		return {
			statusCode: 200,
			body: JSON.stringify({ success: true, data }),
		};
	} catch ({ message }) {
		console.error('While getting recipe:', message);

		return {
			statusCode: 500,
			body: JSON.stringify({ success: false, message }),
		};
	}
}

module.exports = { handler };
