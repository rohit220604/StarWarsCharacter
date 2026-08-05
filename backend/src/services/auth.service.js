"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.getCurrentUser = getCurrentUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_js_1 = require("../utils/jwt.js");
const fakeUser = {
    id: "1",
    username: "admin",
    passwordHash: bcryptjs_1.default.hashSync('password123', 10)
};
function login(username, password) {
    if (username !== fakeUser.username || !bcryptjs_1.default.compare(password, fakeUser.passwordHash)) {
        throw new Error("Invalid credentials");
    }
    const accessToken = (0, jwt_js_1.generateAccessToken)({ userId: fakeUser.id, username: fakeUser.username });
    const refreshToken = (0, jwt_js_1.generateRefreshToken)({ userId: fakeUser.id, username: fakeUser.username });
    return {
        user: {
            id: fakeUser.id,
            username: fakeUser.username
        },
        accessToken,
        refreshToken
    };
}
function getCurrentUser() {
    return {
        id: fakeUser.id,
        username: fakeUser.username
    };
}
//# sourceMappingURL=auth.service.js.map