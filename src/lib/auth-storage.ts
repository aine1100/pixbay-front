"use client";

const ACCESS_TOKEN_KEY = "pixbay_access_token";
const REFRESH_TOKEN_KEY = "pixbay_refresh_token";

export const authStorage = {
    setTokens(accessToken: string, refreshToken: string) {
        if (typeof window !== "undefined") {
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
    },

    getAccessToken() {
        if (typeof window !== "undefined") {
            return localStorage.getItem(ACCESS_TOKEN_KEY);
        }
        return null;
    },

    getRefreshToken() {
        if (typeof window !== "undefined") {
            return localStorage.getItem(REFRESH_TOKEN_KEY);
        }
        return null;
    },

    clearTokens() {
        if (typeof window !== "undefined") {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
    },

    isAuthenticated() {
        return !!this.getRefreshToken();
    },
    
    getUserFromToken() {
        const token = this.getAccessToken();
        if (!token) return null;

        try {
            const base64Url = token.split('.')[1];
            if (!base64Url) return null;
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Error decoding token", e);
            return null;
        }
    },

    isTokenExpired() {
        const token = this.getAccessToken();
        if (!token) return true;

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const { exp } = JSON.parse(jsonPayload);
            if (!exp) return false;

            // exp is in seconds, Date.now() is in milliseconds
            return Date.now() >= exp * 1000;
        } catch (e) {
            return true;
        }
    }
};
