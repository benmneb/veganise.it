import { ApolloServer, gql } from 'apollo-server-express';

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import connectDatabase from './connectDatabase.js';

const port = process.env.PORT || 5000;
const path = '/';

(async function () {
  try {
    const db = await connectDatabase();

    const typeDefs = gql`
      type Recipe {
        name: String
        chef: String
        chefNickname: String
        url: String
        likes: Int
        likedBy: [String]
        image: String
        images: [String]
        video: String
        about: String
        ingredients: [String]
        method: [String]
      }

      type Query {
        recipes: [Recipe]
      }
    `;

    const resolvers = {
      Query: {
        async recipes() {
          const response = db.collection('recipes').find().toArray();
          return response;
        },
      },
    };

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

    console.log(`✅ Server live at ${port}${server.graphqlPath}`);
  } catch (error) {
    console.error('❌ Server connection error:', error);
  }
})();
