import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';
import { authAPI } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const storedToken = localStorage.getItem('crm_token');
        if (storedToken) {
            setToken(storedToken);
            // In a real app, you'd validate the token and fetch user data
            setUser({
                id: '1',
                email: 'social@gajrajah.com',
                name: 'Admin',
                role: 'admin',
            });
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            // Try to authenticate with backend API
            const response = await authAPI.login(email, password);
            const { token: newToken, user: userData } = response;

            localStorage.setItem('crm_token', newToken);
            setToken(newToken);
            setUser(userData);
        } catch (error) {
            console.error('Backend login failed, trying mock authentication:', error);

            // Fallback to mock authentication for demo purposes
            // Valid credentials: social@gajrajah.com / gajrajah@123
            if (email === 'social@gajrajah.com' && password === 'gajrajah@123') {
                const mockToken = 'mock_jwt_token_' + Date.now();
                const mockUser: User = {
                    id: '1',
                    email: 'social@gajrajah.com',
                    name: 'Admin',
                    role: 'admin',
                };

                localStorage.setItem('crm_token', mockToken);
                setToken(mockToken);
                setUser(mockUser);
            } else {
                // Invalid credentials
                throw new Error('Invalid email or password');
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('crm_token');
        setToken(null);
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
