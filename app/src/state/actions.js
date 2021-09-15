import { api } from '../utils';

export function setSearchResults(data) {
	return {
		type: 'SET_SEARCH_RESULTS',
		data,
	};
}

export function search(term, source) {
	return async (dispatch) => {
		try {
			const response = await api.get(`/search/${term}`);
			dispatch(setSearchResults({ term, ...response.data, source }));
		} catch (error) {
			console.error('Search:', error.message);
		}
	};
}

export function like(id) {
	return {
		type: 'LIKE',
		id,
	};
}

export function showSnackbar(data) {
	return {
		type: 'SHOW_SNACKBAR',
		data,
	};
}

export function sliceSnackPack() {
	return {
		type: 'SLICE_SNACKPACK',
	};
}
