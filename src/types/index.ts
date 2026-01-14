export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface StatsCardData {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    subtitle?: string;
}

export interface ApiError {
    message: string;
    status?: number;
}
