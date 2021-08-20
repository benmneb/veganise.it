import { ApolloServer } from 'apollo-server-express';

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import initDb from './db/index.js';
import routes from './routes/index.js';

const port = process.env.PORT || 5000;

(async function () {
	try {
		const server = new ApolloServer({ typeDefs, resolvers });
		await server.start();

		const api = express();

		const limiter = rateLimit({
			windowMs: 15 * 60 * 1000,
			max: 100,
		});

		api.use(cors());
		api.use(helmet());
		api.use('/', limiter);
		api.use(express.urlencoded({ extended: true }));
		api.use(express.json());
		api.use(mongoSanitize());
		api.use(xss());
		api.use(hpp());

		await new Promise((resolve) => api.listen({ port }, resolve));

		console.log(`🚀 Server live at ${server.graphqlPath}`);
	} catch (error) {
		console.error('❌ Server connection error:', error.message);
	}
})();
