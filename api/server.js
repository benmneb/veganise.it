import { ApolloServer } from 'apollo-server-express';

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

const port = process.env.PORT || 4000;
const path = '/';

try {
	const server = new ApolloServer({ typeDefs, resolvers });
	await server.start();

	const app = express();

	server.applyMiddleware({ app, path });

	const limiter = rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 100,
	});

	app.use(cors());
	app.use(helmet());
	app.use(path, limiter);
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(mongoSanitize());
	app.use(xss());
	app.use(hpp());

	await new Promise((resolve) => app.listen({ port }, resolve));

	console.log(`✅ (2/2) Server live at ${port}${server.graphqlPath}`);
} catch (error) {
	console.error('❌ (2/2) Server connection error:', error);
}
