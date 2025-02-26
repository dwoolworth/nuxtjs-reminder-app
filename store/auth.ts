// store/auth.ts
import {defineStore} from 'pinia'

interface LoginResponse {
    access_token: string;
    // Add other properties your API returns
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null as string | null,
        user: null as object | null,
    }),
    getters: {
        isLoggedIn(): boolean {
            return !!this.token
        }
    },
    actions: {
        async login(email: string, password: string) {
            const config = useRuntimeConfig()
            try {
                const {data, error} = await useFetch('/api/v1/auth/login', {
                    baseURL: config.public.apiBase,
                    method: 'POST',
                    body: {email, password},
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                })

                if (error.value) throw new Error(error.value.message || 'Login failed')

                if (data.value && (data.value as LoginResponse).access_token) {
                    this.token = (data.value as LoginResponse).access_token
                    // You might want to fetch user data here if it's not included in the login response
                    // this.user = ...
                    const cookie = useCookie('token')
                    cookie.value = this.token // Set cookie
                    const router = useRouter()
                    router.push('Dashboard') // or wherever you want to redirect after login

                } else {
                    throw new Error('Login failed: No access token received')
                }
            } catch (err) {
                console.error('Login error:', err)
                throw err
            }
        },
        async allReminder() {
            const config = useRuntimeConfig()
            try {
                const {data, error} = await useFetch('https://jsonplaceholder.typicode.com/todos', {
                    // baseURL: config.public.apiBase,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${this.token}` // Ensure this.token is defined
                    },
                });

                if (error.value) throw new Error(error.value.message || 'Login failed')

                console.log("allReminder-------data-----", data, data.value);

                // if (data.value && data.value.access_token) {
                //     this.token = data.value.access_token
                //     // You might want to fetch user data here if it's not included in the login response
                //     // this.user = ...
                //     const cookie = useCookie('token')
                //     cookie.value = data.value.access_token // Set cookie
                //     const router = useRouter()
                //     router.push('home/index') // or wherever you want to redirect after login
                //
                // } else {
                //     throw new Error('Login failed: No access token received')
                // }
                return data.value;

            } catch (err) {
                console.error('Login error:', err)
                throw err
            }
        },

        async currentWeather() {
            const config = useRuntimeConfig()
            try {
                const {
                    data,
                    error
                } = await useFetch('https://api.openweathermap.org/data/2.5/weather?lat=28.50&lon=77.38&appid=9fe6458d6cc9f452028ba1ce6f826672', {
                    // baseURL: config.public.apiBase,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${this.token}` // Ensure this.token is defined
                    },
                });

                if (error.value) throw new Error(error.value.message || 'Login failed')

                console.log("allReminder-------data-----", data, data.value);

                // if (data.value && data.value.access_token) {
                //     this.token = data.value.access_token
                //     // You might want to fetch user data here if it's not included in the login response
                //     // this.user = ...
                //     const cookie = useCookie('token')
                //     cookie.value = data.value.access_token // Set cookie
                //     const router = useRouter()
                //     router.push('home/index') // or wherever you want to redirect after login
                //
                // } else {
                //     throw new Error('Login failed: No access token received')
                // }
                return data.value;

            } catch (err) {
                console.error('Login error:', err)
                throw err
            }
        },
        // ... other actions
        logout() {
            this.token = null
            this.user = null
            const cookie = useCookie('token')
            cookie.value = null // Remove cookie
            navigateTo('/login')
        },
        init() {
            const cookie = useCookie('token')
            if (cookie.value) {
                this.token = cookie.value
                // Optionally fetch user data here
            }
        },
    },
    // ... getters
})