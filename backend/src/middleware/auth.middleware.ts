import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt.js'
import { JwtPayload } from '../types/auth.js'

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Access token required"
        })
    }
    
    const parts = authHeader.split(' ')
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
    
    const token = parts[1]
    
    try {
        const decoded = verifyAccessToken(token)
        ;(req as any).user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
}