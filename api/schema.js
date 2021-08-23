import { gql } from 'apollo-server-express';

export const typeDefs = gql`
	type Recipe {
		_id: String!
		title: String!
		author: String!
		authorNickname: String
		url: String!
		likes: Int!
		image: String!
		images: [String]
		video: String
		about: String!
		ingredients: String!
		method: String!
	}

	type Query {
		recipes: [Recipe!]!
		recipe(id: String!): Recipe!
		search(term: String!): [Recipe]
	}

	type Mutation {
		like(id: String!): Recipe!
	}
`;
