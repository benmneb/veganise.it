import { gql } from 'apollo-server-express';

export const typeDefs = gql`
	type Recipe {
		_id: String!
		title: String!
		author: String!
		url: String!
		likes: Int
		image: String!
		images: [String]
		video: String
		about: [String]
		ingredients: Ingredients
		method: Method
	}

	type Ingredients {
		default: [String]
	}

	type Method {
		default: [String]
	}

	type SubmitRecipes {
		success: Boolean!
		errorMessage: String
	}

	type Advertiser {
		success: Boolean!
		errorMessage: String
	}

	type Query {
		recipes: [Recipe!]!
		recipe(id: String!): Recipe!
		search(term: String!): [Recipe]
	}

	type Mutation {
		like(id: String!): Recipe!
		submit(url: String!): SubmitRecipes
		advertise(email: String!): Advertiser
	}
`;
