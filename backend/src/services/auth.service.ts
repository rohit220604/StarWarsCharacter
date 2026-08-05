import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js'

const fakeUser = {
    id: "1",
    username: "admin",
    passwordHash: bcrypt.hashSync('password123', 10)
}

export function login(username: string, password: string) {
    if (username !== fakeUser.username || !bcrypt.compare(password, fakeUser.passwordHash)) {
        throw new Error("Invalid credentials")
    }
    
    const accessToken = generateAccessToken({ userId: fakeUser.id, username: fakeUser.username })
    const refreshToken = generateRefreshToken({ userId: fakeUser.id, username: fakeUser.username })
    
    return {
        user: {
            id: fakeUser.id,
            username: fakeUser.username
        },
        accessToken,
        refreshToken
    }
}

export function getCurrentUser() {
    return {
        id: fakeUser.id,
        username: fakeUser.username
    }
}