// User Management Module Types

export type UserRole = 'Pre-Sales' | 'Telecaller' | 'Sales' | 'Executive' | 'BDM' | 'Manager';
export type UserStatus = 'Active' | 'Inactive';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    department: string;
    joinDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserFormData {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    department: string;
}

export interface UserFilters {
    role?: string;
    status?: string;
    search?: string;
}

export interface UsersResponse {
    users: User[];
    total: number;
    page: number;
    totalPages: number;
}
