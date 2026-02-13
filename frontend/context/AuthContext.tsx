import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (access: string, refresh: string) => void;
    logout: () => void;
    refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('jdpc_access_token'));
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('jdpc_refresh_token'));

    const login = (access: string, refresh: string) => {
        localStorage.setItem('jdpc_access_token', access);
        localStorage.setItem('jdpc_refresh_token', refresh);
        setToken(access);
        setRefreshToken(refresh);
    };

    const logout = () => {
        localStorage.removeItem('jdpc_access_token');
        localStorage.removeItem('jdpc_refresh_token');
        setToken(null);
        setRefreshToken(null);
    };

    const refreshAccessToken = async () => {
        if (!refreshToken) return false;
        try {
            const response = await fetch(API_ENDPOINTS.TOKEN_REFRESH, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('jdpc_access_token', data.access);
                setToken(data.access);
                return true;
            }
            logout();
            return false;
        } catch (error) {
            console.error("Token refresh failed:", error);
            logout();
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
