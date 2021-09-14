import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import connectDatabase from './connectDatabase.js';
import routes from './routes.js';

const port = process.env.PORT || 5000;
const path = '/';

const server = express();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
});

server.use(cors());
server.use(helmet());
server.use(path, limiter);
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(mongoSanitize());
server.use(xss());
server.use(hpp());

try {
	const db = await connectDatabase();
	routes(server, db).listen(port, () => {
		console.log(`✅ Server live @ ${port}\n🚀 All systems go`);
	});
} catch (error) {
	console.error('❌ Server connection error\n', error);
}
