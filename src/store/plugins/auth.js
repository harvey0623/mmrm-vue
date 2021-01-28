export const authPlugin = function(store) {
	store.dispatch('auth/checkAuthCookie');
	store.subscribe((mutation, state) => {
		
	});
}