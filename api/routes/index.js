export default function routes(app, db) {
	const highScores = db.collection('highScores');

	// app.get('/', (req, res) => {
	//   res.send('Hello World!!1 🤓');
	// });

	// app.get('/api', async (req, res) => {
	//   try {
	//     const response = await highScores.find().sort({ score: -1, date: 1 }).limit(5).toArray();
	//     res.status(200).json(response);
	//   } catch (error) {
	//     res.status(500).json({ 'Error getting scores': error.message });
	//     console.error('Error getting scores:', error.message);
	//   }
	// });

	// app.post('/api', async (req, res) => {
	//   const { name, score } = req.body;

	//   try {
	//     const result = await highScores.insertOne({ name, score, date: new Date() });
	//     res.status(200).json(result);
	//   } catch (error) {
	//     res.status(500).json({ 'Error adding score': error.message });
	//     console.error('Error adding score:', error.message);
	//   }
	// });

	return app;
}
