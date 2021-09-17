export function setSearchData(data) {
	return {
		type: 'SET_SEARCH_DATA',
		data,
	};
}

export function setLoadingSearch(state) {
	return {
		type: 'SET_LOADING_SEARCH',
		state,
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
