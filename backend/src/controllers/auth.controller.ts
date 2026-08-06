import { Request, Response } from 'express'
import { login as authLogin, getCurrentUser as authGetCurrentUser } from '../services/auth.service.js'

export async function login(req: Request, res: Response) {
    const { username, password } = req.body
    
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        })
    }
    
    try {
        const result = await authLogin(username, password)
        return res.status(200).json({
            success: true,
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        })
    }
}

export function getCurrentUser(req: Request, res: Response) {
    const user = authGetCurrentUser()
    return res.status(200).json({
        success: true,
        user
    })
}