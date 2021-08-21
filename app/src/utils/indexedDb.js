import {
	createStore,
	set as idbSet,
	get as idbGet,
	update as idbUpdate,
} from 'idb-keyval';

const store = createStore('veganise.it', 'recipe-likes');

export const set = (key, val) => idbSet(key, val, store);
export const get = (key) => idbGet(key, store);
export const update = (key, func) => idbUpdate(key, func, store);
