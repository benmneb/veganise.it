import { ObjectId } from 'mongodb';

import connectDatabase from './connectDatabase.js';

const db = await connectDatabase();
const recipes = db.collection('recipes');

export const resolvers = {
	Query: {
		async recipes() {
			return recipes.find().toArray();
		},
		async recipe(_, { id }) {
			return recipes.findOne(ObjectId(id));
		},
		async search(_, { term }) {
			return recipes.find({ $text: { $search: term } }).toArray();
		},
	},
	Mutation: {
		async like(_, { id }) {
			const response = await recipes.findOneAndUpdate(
				{ _id: ObjectId(id) },
				{ $inc: { likes: 1 } },
				{ returnDocument: 'after' }
			);
			return response.value;
		},
	},
};
