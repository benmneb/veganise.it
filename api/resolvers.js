import { ObjectId } from 'mongodb';

import connectDatabase from './connectDatabase.js';

import { transporter } from './transporter.js';

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
		async submit(_, { url }) {
			try {
				await transporter.sendMail({
					from: process.env.GMAIL_USER,
					to: process.env.GMAIL_USER,
					subject: '🧑‍🍳 Veganise It! New Recipe Submission',
					html: `Someone suggested: ${url}`,
				});
				return { success: true };
			} catch (error) {
				return { success: false, errorMessage: error.message };
			}
		},
	},
};
