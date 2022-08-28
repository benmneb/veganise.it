// The following example adds a validator to an existing collection...
// https://docs.mongodb.com/manual/reference/command/collMod/#add-document-validation-to-an-existing-collection

const validator = {
	$jsonSchema: {
		bsonType: 'object',
		required: ['url', 'title', 'image', 'author'],
		properties: {
			url: {
				bsonType: 'string',
			},
			title: {
				bsonType: 'string',
			},
			image: {
				bsonType: 'string',
			},
			author: {
				bsonType: 'string',
			},
			about: {
				bsonType: 'array',
			},
			likes: {
				bsonType: 'int',
			},
			video: {
				bsonType: 'string',
			},
			featured: {
				bsonType: 'array',
			},
			stats: {
				bsonType: 'array',
			},
			nutrition: {
				bsonType: 'array',
			},
			'before you start': {
				bsonType: 'array',
			},
			category: {
				bsonType: ['array'],
			},
			ingredients: {
				bsonType: 'object',
				properties: {
					default: {
						bsonType: 'array',
					},
					additionalProperties: {
						bsonType: 'array',
					},
				},
			},
			method: {
				bsonType: 'object',
				properties: {
					default: {
						bsonType: 'array',
					},
					additionalProperties: {
						bsonType: 'array',
					},
				},
			},
		},
	},
};
