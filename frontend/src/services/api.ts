import axios from 'axios'

export const api = axios.create({
    baseURL: import.meta.env.VITE_SWAPI_URL,
    timeout: 10000
})