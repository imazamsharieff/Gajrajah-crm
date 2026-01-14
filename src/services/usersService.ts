import axios from 'axios';
import type { User, UserFormData, UserFilters, UsersResponse } from '../types/users';

const API_URL = 'http://localhost:6061';

const getAuthHeaders = () => {
    const token = localStorage.getItem('crm_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const usersAPI = {
    // List users
    getUsers: async (filters: UserFilters, page: number = 1, limit: number = 10): Promise<UsersResponse> => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const response = await axios.get(`${API_URL}/users?${params}`, getAuthHeaders());
        return response.data;
    },

    // Get single user
    getUser: async (id: string): Promise<User> => {
        const response = await axios.get(`${API_URL}/users/${id}`, getAuthHeaders());
        return response.data;
    },

    // Create user
    createUser: async (data: UserFormData): Promise<User> => {
        const response = await axios.post(`${API_URL}/users`, data, getAuthHeaders());
        return response.data;
    },

    // Update user
    updateUser: async (id: string, data: UserFormData): Promise<User> => {
        const response = await axios.put(`${API_URL}/users/${id}`, data, getAuthHeaders());
        return response.data;
    },

    // Update user status
    updateUserStatus: async (id: string, status: 'Active' | 'Inactive'): Promise<User> => {
        const response = await axios.patch(`${API_URL}/users/${id}/status`, { status }, getAuthHeaders());
        return response.data;
    },

    // Delete user
    deleteUser: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/users/${id}`, getAuthHeaders());
    },

    // Get available roles
    getRoles: async (): Promise<string[]> => {
        const response = await axios.get(`${API_URL}/roles`, getAuthHeaders());
        return response.data;
    },
};
