export declare function login(username: string, password: string): {
    user: {
        id: string;
        username: string;
    };
    accessToken: string;
    refreshToken: string;
};
export declare function getCurrentUser(): {
    id: string;
    username: string;
};
//# sourceMappingURL=auth.service.d.ts.map