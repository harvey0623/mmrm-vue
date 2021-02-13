export const authPlugin = function(store) {
	store.dispatch('auth/checkAuthCookie');
	store.dispatch('auth/checkPwVerify');
	store.subscribe((mutation, state) => {
		
	});
}