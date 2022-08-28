require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

const clientPromise = client.connect();

async function handler({ body, httpMethod }) {
	if (httpMethod !== 'POST') {
		return {
			statusCode: 405,
			headers: {
				Allow: 'POST',
			},
		};
	}

	const { id } = JSON.parse(body);

	if (!id) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				success: false,
				message: 'Invalid request, please check request body includes an ID',
				body: JSON.parse(body),
			}),
		};
	}

	try {
		const db = (await clientPromise).db(process.env.MONGO_DB);
		const recipes = db.collection(process.env.MONGO_COLLECTION);

		const response = await recipes.findOneAndUpdate(
			{ _id: ObjectId(id) },
			{ $inc: { likes: 1 } },
			{ returnDocument: 'after' }
		);

		return {
			statusCode: 200,
			body: JSON.stringify({
				success: true,
				data: { likes: response.value.likes },
			}),
		};
	} catch ({ message }) {
		console.error('While liking recipe:', message);
		return {
			statusCode: 500,
			body: JSON.stringify({ success: false, message }),
		};
	}
}

module.exports = { handler };
