import { Request } from 'express'

export interface JwtPayload {
    userId: string;
    username: string;
}

export interface AuthRequest extends Request {
    user: JwtPayload
}
