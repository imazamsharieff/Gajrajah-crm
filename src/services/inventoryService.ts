import axios from 'axios';
import {
    Inventory,
    InventoryFormData,
    InventoryFilters,
    InventorySummary,
    InventoryListResponse,
    InventoryHistory,
    InventoryFile,
    ProjectInventorySummary,
} from '../types/inventory';

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

export const inventoryAPI = {
    // Get inventory list with filters
    getInventory: async (
        filters: InventoryFilters,
        page: number = 1,
        limit: number = 10,
        sortBy: string = 'createdAt',
        sortOrder: string = 'desc'
    ): Promise<InventoryListResponse> => {
        const params: any = {
            page,
            limit,
            sortBy,
            sortOrder,
        };

        if (filters.project !== 'All') params.project = filters.project;
        if (filters.status !== 'All') params.status = filters.status;
        if (filters.facing !== 'All') params.facing = filters.facing;
        if (filters.search) params.search = filters.search;
        if (filters.minSize) params.minSize = filters.minSize;
        if (filters.maxSize) params.maxSize = filters.maxSize;

        const response = await api.get<InventoryListResponse>('/inventory', { params });
        return response.data;
    },

    // Get inventory summary
    getSummary: async (): Promise<InventorySummary> => {
        const response = await api.get<InventorySummary>('/inventory/summary');
        return response.data;
    },

    // Get project-level inventory summary
    getProjectSummary: async (): Promise<ProjectInventorySummary[]> => {
        const response = await api.get<ProjectInventorySummary[]>('/inventory/project-summary');
        return response.data;
    },

    // Get map view data
    getMapView: async (projectId?: string): Promise<Inventory[]> => {
        const params: any = {};
        if (projectId && projectId !== 'All') params.project = projectId;

        const response = await api.get<Inventory[]>('/inventory/map', { params });
        return response.data;
    },

    // Get single inventory
    getInventoryItem: async (id: string): Promise<Inventory> => {
        const response = await api.get<Inventory>(`/inventory/${id}`);
        return response.data;
    },

    // Create inventory
    createInventory: async (data: InventoryFormData): Promise<Inventory> => {
        const response = await api.post<Inventory>('/inventory', data);
        return response.data;
    },

    // Update inventory
    updateInventory: async (id: string, data: Partial<InventoryFormData>): Promise<Inventory> => {
        const response = await api.put<Inventory>(`/inventory/${id}`, data);
        return response.data;
    },

    // Partial update (inline editing)
    patchInventory: async (id: string, data: Partial<Inventory>): Promise<Inventory> => {
        const response = await api.patch<Inventory>(`/inventory/${id}`, data);
        return response.data;
    },

    // Delete inventory
    deleteInventory: async (id: string): Promise<void> => {
        await api.delete(`/inventory/${id}`);
    },

    // Get history
    getHistory: async (id: string): Promise<InventoryHistory[]> => {
        const response = await api.get<InventoryHistory[]>(`/inventory/${id}/history`);
        return response.data;
    },

    // Add history entry
    addHistory: async (id: string, entry: { type: string; description: string; createdBy: string }): Promise<InventoryHistory> => {
        const response = await api.post<InventoryHistory>(`/inventory/${id}/history`, entry);
        return response.data;
    },

    // Get files
    getFiles: async (id: string): Promise<InventoryFile[]> => {
        const response = await api.get<InventoryFile[]>(`/inventory/${id}/files`);
        return response.data;
    },

    // Upload file
    uploadFile: async (id: string, file: { name: string; size: string; uploadedBy: string }): Promise<InventoryFile> => {
        const response = await api.post<InventoryFile>(`/inventory/${id}/files`, file);
        return response.data;
    },

    // Delete file
    deleteFile: async (id: string, fileId: string): Promise<void> => {
        await api.delete(`/inventory/${id}/files/${fileId}`);
    },
};

export default api;
