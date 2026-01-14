import api from './api';
import { Lead, Activity, LeadStatus, LeadSource, ActivityType, LeadFormData, LeadFilters } from '../types/leads';

// Fetch projects from backend
export const getProjects = async (): Promise<string[]> => {
    try {
        const response = await api.get('/projects', { params: { limit: 100 } });
        return response.data.projects.map((project: any) => project.name);
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return [];
    }
};

// Sample users for assignment
export const availableUsers = [
    'Admin',
    'Rajesh Kumar',
    'Priya Sharma',
    'Amit Patel',
    'Sneha Reddy',
];

// API-like functions
export const leadsService = {
    // Get all leads with optional filters
    getLeads: async (filters?: LeadFilters): Promise<Lead[]> => {
        const params: any = {};

        if (filters) {
            if (filters.search) params.search = filters.search;
            if (filters.status && filters.status !== 'all') params.status = filters.status;
            if (filters.source && filters.source !== 'all') params.source = filters.source;
            if (filters.assignedTo && filters.assignedTo !== 'all') params.assignedTo = filters.assignedTo;
            if (filters.dateFrom) params.dateFrom = filters.dateFrom.toISOString();
            if (filters.dateTo) params.dateTo = filters.dateTo.toISOString();
        }

        const response = await api.get('/leads', { params });

        // Convert date strings back to Date objects
        return response.data.leads.map((lead: any) => ({
            ...lead,
            createdAt: new Date(lead.createdAt),
            updatedAt: new Date(lead.updatedAt),
            lastFollowUp: lead.lastFollowUp ? new Date(lead.lastFollowUp) : null,
        }));
    },

    // Get single lead by ID
    getLead: async (id: string): Promise<Lead | null> => {
        try {
            const response = await api.get(`/leads/${id}`);
            const lead = response.data;
            return {
                ...lead,
                createdAt: new Date(lead.createdAt),
                updatedAt: new Date(lead.updatedAt),
                lastFollowUp: lead.lastFollowUp ? new Date(lead.lastFollowUp) : null,
            };
        } catch (error) {
            return null;
        }
    },

    // Create new lead
    createLead: async (data: LeadFormData): Promise<Lead> => {
        const response = await api.post('/leads', data);
        const lead = response.data;
        return {
            ...lead,
            createdAt: new Date(lead.createdAt),
            updatedAt: new Date(lead.updatedAt),
            lastFollowUp: lead.lastFollowUp ? new Date(lead.lastFollowUp) : null,
        };
    },

    // Update existing lead
    updateLead: async (id: string, data: Partial<LeadFormData>): Promise<Lead | null> => {
        try {
            const response = await api.put(`/leads/${id}`, data);
            const lead = response.data;
            return {
                ...lead,
                createdAt: new Date(lead.createdAt),
                updatedAt: new Date(lead.updatedAt),
                lastFollowUp: lead.lastFollowUp ? new Date(lead.lastFollowUp) : null,
            };
        } catch (error) {
            return null;
        }
    },

    // Delete lead
    deleteLead: async (id: string): Promise<boolean> => {
        try {
            await api.delete(`/leads/${id}`);
            return true;
        } catch (error) {
            return false;
        }
    },

    // Get activities for a lead
    getActivities: async (leadId: string): Promise<Activity[]> => {
        const response = await api.get(`/leads/${leadId}/activities`);
        return response.data.map((activity: any) => ({
            ...activity,
            createdAt: new Date(activity.createdAt),
        }));
    },

    // Add activity
    addActivity: async (leadId: string, type: ActivityType, description: string, createdBy: string): Promise<Activity> => {
        const response = await api.post(`/leads/${leadId}/activities`, {
            type,
            description,
            createdBy,
        });
        const activity = response.data;
        return {
            ...activity,
            createdAt: new Date(activity.createdAt),
        };
    },

    // Update lead status
    updateLeadStatus: async (id: string, status: LeadStatus): Promise<Lead | null> => {
        try {
            const response = await api.patch(`/leads/${id}/status`, { status });
            const lead = response.data;
            return {
                ...lead,
                createdAt: new Date(lead.createdAt),
                updatedAt: new Date(lead.updatedAt),
                lastFollowUp: lead.lastFollowUp ? new Date(lead.lastFollowUp) : null,
            };
        } catch (error) {
            return null;
        }
    },
};
