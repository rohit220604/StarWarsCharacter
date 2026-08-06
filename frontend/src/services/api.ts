import axios from 'axios'

export const swapiApi = axios.create({
    baseURL: import.meta.env.VITE_SWAPI_URL,
    timeout: 10000
})

export const backendApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000
})

backendApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
