import axios from 'axios';
import {
    Project,
    ProjectFormData,
    ProjectFilters,
    ProjectSummary,
    ProjectsListResponse,
    InventoryUnit,
    ProjectFile,
    ProjectActivity,
    Manager,
} from '../types/projects';

const API_BASE_URL = 'http://localhost:6061';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('crm_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('crm_token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const projectsAPI = {
    // Get projects list with filters
    getProjects: async (
        filters: ProjectFilters,
        page: number = 1,
        limit: number = 10,
        sortBy: string = 'createdAt',
        sortOrder: string = 'desc'
    ): Promise<ProjectsListResponse> => {
        const params: any = {
            page,
            limit,
            sortBy,
            sortOrder,
        };

        if (filters.category !== 'All') params.category = filters.category;
        if (filters.status !== 'All') params.status = filters.status;
        if (filters.city !== 'All') params.city = filters.city;
        if (filters.manager !== 'All') params.manager = filters.manager;
        if (filters.search) params.search = filters.search;

        const response = await api.get<ProjectsListResponse>('/projects', { params });
        return response.data;
    },

    // Get project summary
    getSummary: async (): Promise<ProjectSummary> => {
        const response = await api.get<ProjectSummary>('/projects/summary');
        return response.data;
    },

    // Get single project
    getProject: async (id: string): Promise<Project> => {
        const response = await api.get<Project>(`/projects/${id}`);
        return response.data;
    },

    // Create project
    createProject: async (data: ProjectFormData): Promise<Project> => {
        const response = await api.post<Project>('/projects', data);
        return response.data;
    },

    // Update project
    updateProject: async (id: string, data: Partial<ProjectFormData>): Promise<Project> => {
        const response = await api.put<Project>(`/projects/${id}`, data);
        return response.data;
    },

    // Update project status
    updateProjectStatus: async (id: string, status: string): Promise<Project> => {
        const response = await api.patch<Project>(`/projects/${id}/status`, { status });
        return response.data;
    },

    // Delete project
    deleteProject: async (id: string): Promise<void> => {
        await api.delete(`/projects/${id}`);
    },

    // Get inventory
    getInventory: async (projectId: string, facing?: string, status?: string): Promise<InventoryUnit[]> => {
        const params: any = {};
        if (facing && facing !== 'All') params.facing = facing;
        if (status && status !== 'All') params.status = status;

        const response = await api.get<InventoryUnit[]>(`/projects/${projectId}/inventory`, { params });
        return response.data;
    },

    // Get inventory summary
    getInventorySummary: async (projectId: string): Promise<{ total: number; available: number; sold: number }> => {
        const response = await api.get(`/projects/${projectId}/inventory/summary`);
        return response.data;
    },

    // Get files
    getFiles: async (projectId: string): Promise<ProjectFile[]> => {
        const response = await api.get<ProjectFile[]>(`/projects/${projectId}/files`);
        return response.data;
    },

    // Upload file
    uploadFile: async (projectId: string, file: { name: string; size: string; uploadedBy: string }): Promise<ProjectFile> => {
        const response = await api.post<ProjectFile>(`/projects/${projectId}/files`, file);
        return response.data;
    },

    // Delete file
    deleteFile: async (projectId: string, fileId: string): Promise<void> => {
        await api.delete(`/projects/${projectId}/files/${fileId}`);
    },

    // Get activity
    getActivity: async (projectId: string): Promise<ProjectActivity[]> => {
        const response = await api.get<ProjectActivity[]>(`/projects/${projectId}/activity`);
        return response.data;
    },

    // Add activity
    addActivity: async (projectId: string, activity: { type: string; description: string; createdBy: string }): Promise<ProjectActivity> => {
        const response = await api.post<ProjectActivity>(`/projects/${projectId}/activity`, activity);
        return response.data;
    },

    // Get managers
    getManagers: async (): Promise<Manager[]> => {
        const response = await api.get<Manager[]>('/users?role=manager');
        return response.data;
    },

    // Get cities
    getCities: async (): Promise<string[]> => {
        const response = await api.get<string[]>('/cities');
        return response.data;
    },
};

export default api;
