const initialState = {
	searchResults: null,
	snackPack: [],
};

export function reducer(state = initialState, action) {
	switch (action.type) {
		case 'SET_SEARCH_RESULTS':
			return {
				...state,
				searchResults: action.data,
			};
		case 'LIKE':
			return {
				...state,
				searchResults: {
					...state.searchResults,
					data: [
						...state.searchResults.data.map((recipe) =>
							recipe._id === action.id
								? { ...recipe, likes: recipe.likes + 1 }
								: recipe
						),
					],
				},
			};
		case 'SHOW_SNACKBAR':
			return {
				...state,
				snackPack: [
					...state.snackPack,
					{ ...action.data, key: new Date().getTime() },
				],
			};
		case 'SLICE_SNACKPACK':
			return {
				...state,
				snackPack: [...state.snackPack.slice(1)],
			};
		default:
			return state;
	}
}
