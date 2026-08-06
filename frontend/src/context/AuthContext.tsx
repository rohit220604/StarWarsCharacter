import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { backendApi } from '../services/api.js'

interface User {
    id: string
    username: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    login: (accessToken: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            backendApi.get('/auth/me')
                .then((res) => {
                    setUser(res.data.user)
                })
                .catch(() => {
                    localStorage.removeItem('accessToken')
                })
        }
    }, [])

    const login = async (accessToken: string) => {
        localStorage.setItem('accessToken', accessToken)
        const res = await backendApi.get('/auth/me')
        setUser(res.data.user)
    }

    const logout = () => {
        localStorage.removeItem('accessToken')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
