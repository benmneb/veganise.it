import { useDispatch } from 'react-redux';
import { compliments, maxPossibleLikes } from '../assets';
import { update, api } from '../utils';
import { like } from '../state';

/**
 * Use to handle "like"/"compliment" press on recipes
 * @param {string} id - The MongoDB ObjectID of the recipe
 * @param {number} userLikes - The amount of like the user has left in this session (mapped to IndexDB)
 * @param {React.Dispatch<React.SetStateAction<null | string>>} setCompliment - The local state function that renders the "compliment" on the screen
 * @returns The function that actually processes the action
 */
export function useHandleLike(id, userLikes, setCompliment) {
	const dispatch = useDispatch();

	return async () => {
		if (userLikes >= maxPossibleLikes) return;

		// Set a random compliment thats not the one immediately preceeding it
		setCompliment(
			(prev) =>
				compliments.filter((comp) => comp !== prev)[
					Math.floor(Math.random() * compliments.length)
				]
		);

		try {
			// Add to mongo for long term global storage
			await api.post('/like', { id });

			// Update redux state so changes are reflected locally without a re-fetch
			dispatch(like(id));

			// Add to IndexedDB so they can't leave unlimited likes
			update(id, (val) => (val || 0) + 1).catch((err) =>
				console.error('error updating indexedDb:', err)
			);
		} catch (error) {
			console.error('While liking a recipe:', error.message);
			setCompliment('Could not like 😵');
			setTimeout(() => setCompliment('Try again soon! 🙏'), 2000);
		}
	};
}
