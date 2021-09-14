import mongodb from 'mongodb';

const uri = process.env.MONGO_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/';

const client = new mongodb.MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

export default async function connectDatabase() {
	try {
		await client.connect();
		const db = client.db('veganise-it');
		await db.command({ ping: 1 });
		console.log('✅ MongoDB connected');
		return db;
	} catch (error) {
		console.error('❌ MongoDB connection error:', error.message);
	}
}
