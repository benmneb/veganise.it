const initialState = {
	searchData: null,
	loadingSearch: false,
	snackPack: [],
	deferredInstallPrompt: null,
};

export function reducer(state = initialState, action) {
	switch (action.type) {
		case 'SET_SEARCH_DATA':
			return {
				...state,
				searchData: action.data,
			};
		case 'UPDATE_SEARCH_RESULTS_ON_SCROLL':
			return {
				...state,
				searchData: {
					...state.searchData,
					results: [...state.searchData.results, ...action.data],
				},
			};
		case 'SET_LOADING_SEARCH':
			return {
				...state,
				loadingSearch: action.state,
			};
		case 'LIKE':
			return {
				...state,
				searchData: {
					...state.searchData,
					results: [
						...state.searchData.results.map((recipe) =>
							recipe._id === action.id
								? { ...recipe, likes: (recipe.likes || 0) + 1 }
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
		case 'SET_DEFERRED_INSTALL_PROMPT':
			return {
				...state,
				deferredInstallPrompt: action.prompt,
			};
		default:
			return state;
	}
}
