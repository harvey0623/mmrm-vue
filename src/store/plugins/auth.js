export const authPlugin = function(store) {
	store.dispatch('auth/decodeUserInfo');
	store.subscribe((mutation, state) => {
		
	});
}