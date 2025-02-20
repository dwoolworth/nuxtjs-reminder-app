

export default defineNuxtRouteMiddleware((to, from) => {
    //const { isLoggedIn } = useAuth();
    const isLoggedIn = true;
    if (!isLoggedIn) {
        return navigateTo('/login');
    }
})