import axios from 'axios';
import type {
    UserProfile,
    User,
    Role,
    AutomationRule,
    Integrations,
    NotificationSettings,
    BrandingSettings,
    AuditLogsResponse,
    BillingInfo,
    SystemDefaults,
} from '../types/settings';

const API_URL = 'http://localhost:6061';

const getAuthHeaders = () => {
    const token = localStorage.getItem('crm_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const settingsAPI = {
    // My Profile
    getProfile: async (): Promise<UserProfile> => {
        const response = await axios.get(`${API_URL}/me`, getAuthHeaders());
        return response.data;
    },

    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        const response = await axios.put(`${API_URL}/me`, data, getAuthHeaders());
        return response.data;
    },

    updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        await axios.put(`${API_URL}/me/password`, { currentPassword, newPassword }, getAuthHeaders());
    },

    updateAvatar: async (avatar: string): Promise<UserProfile> => {
        const response = await axios.put(`${API_URL}/me/avatar`, { avatar }, getAuthHeaders());
        return response.data;
    },

    updateSignature: async (signature: string): Promise<UserProfile> => {
        const response = await axios.put(`${API_URL}/me/signature`, { signature }, getAuthHeaders());
        return response.data;
    },

    // User Management
    getUsers: async (role?: string, status?: string, search?: string): Promise<User[]> => {
        const params = new URLSearchParams();
        if (role) params.append('role', role);
        if (status) params.append('status', status);
        if (search) params.append('search', search);

        const response = await axios.get(`${API_URL}/users?${params}`, getAuthHeaders());
        return response.data;
    },

    createUser: async (data: Partial<User>): Promise<User> => {
        const response = await axios.post(`${API_URL}/users`, data, getAuthHeaders());
        return response.data;
    },

    updateUser: async (id: string, data: Partial<User>): Promise<User> => {
        const response = await axios.put(`${API_URL}/users/${id}`, data, getAuthHeaders());
        return response.data;
    },

    updateUserStatus: async (id: string, status: string): Promise<User> => {
        const response = await axios.patch(`${API_URL}/users/${id}/status`, { status }, getAuthHeaders());
        return response.data;
    },

    resetPassword: async (id: string): Promise<void> => {
        await axios.post(`${API_URL}/users/${id}/reset-password`, {}, getAuthHeaders());
    },

    // Roles & Permissions
    getRoles: async (): Promise<Role[]> => {
        const response = await axios.get(`${API_URL}/roles`, getAuthHeaders());
        return response.data;
    },

    createRole: async (data: Partial<Role>): Promise<Role> => {
        const response = await axios.post(`${API_URL}/roles`, data, getAuthHeaders());
        return response.data;
    },

    updateRole: async (id: string, data: Partial<Role>): Promise<Role> => {
        const response = await axios.put(`${API_URL}/roles/${id}`, data, getAuthHeaders());
        return response.data;
    },

    deleteRole: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/roles/${id}`, getAuthHeaders());
    },

    updatePermissions: async (id: string, permissions: any): Promise<Role> => {
        const response = await axios.put(`${API_URL}/roles/${id}/permissions`, { permissions }, getAuthHeaders());
        return response.data;
    },

    // Automation
    getAutomationRules: async (): Promise<AutomationRule[]> => {
        const response = await axios.get(`${API_URL}/automation/rules`, getAuthHeaders());
        return response.data;
    },

    createAutomationRule: async (data: Partial<AutomationRule>): Promise<AutomationRule> => {
        const response = await axios.post(`${API_URL}/automation/rules`, data, getAuthHeaders());
        return response.data;
    },

    updateAutomationRule: async (id: string, data: Partial<AutomationRule>): Promise<AutomationRule> => {
        const response = await axios.put(`${API_URL}/automation/rules/${id}`, data, getAuthHeaders());
        return response.data;
    },

    deleteAutomationRule: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/automation/rules/${id}`, getAuthHeaders());
    },

    // Integrations
    getIntegrations: async (): Promise<Integrations> => {
        const response = await axios.get(`${API_URL}/settings/integrations`, getAuthHeaders());
        return response.data;
    },

    updateIntegrations: async (data: Partial<Integrations>): Promise<Integrations> => {
        const response = await axios.put(`${API_URL}/settings/integrations`, data, getAuthHeaders());
        return response.data;
    },

    testIntegration: async (type: string): Promise<{ success: boolean; message: string }> => {
        const response = await axios.post(`${API_URL}/settings/integrations/test`, { type }, getAuthHeaders());
        return response.data;
    },

    // Notifications
    getNotificationSettings: async (): Promise<NotificationSettings> => {
        const response = await axios.get(`${API_URL}/settings/notifications`, getAuthHeaders());
        return response.data;
    },

    updateNotificationSettings: async (data: Partial<NotificationSettings>): Promise<NotificationSettings> => {
        const response = await axios.put(`${API_URL}/settings/notifications`, data, getAuthHeaders());
        return response.data;
    },

    // Branding
    getBrandingSettings: async (): Promise<BrandingSettings> => {
        const response = await axios.get(`${API_URL}/settings/branding`, getAuthHeaders());
        return response.data;
    },

    updateBrandingSettings: async (data: Partial<BrandingSettings>): Promise<BrandingSettings> => {
        const response = await axios.put(`${API_URL}/settings/branding`, data, getAuthHeaders());
        return response.data;
    },

    // Audit Logs
    getAuditLogs: async (
        user?: string,
        module?: string,
        fromDate?: string,
        toDate?: string,
        page: number = 1,
        limit: number = 20
    ): Promise<AuditLogsResponse> => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        if (user) params.append('user', user);
        if (module) params.append('module', module);
        if (fromDate) params.append('fromDate', fromDate);
        if (toDate) params.append('toDate', toDate);

        const response = await axios.get(`${API_URL}/audit-logs?${params}`, getAuthHeaders());
        return response.data;
    },

    // Billing
    getBillingInfo: async (): Promise<BillingInfo> => {
        const response = await axios.get(`${API_URL}/settings/billing`, getAuthHeaders());
        return response.data;
    },

    // System Defaults
    getSystemDefaults: async (): Promise<SystemDefaults> => {
        const response = await axios.get(`${API_URL}/settings/defaults`, getAuthHeaders());
        return response.data;
    },

    updateSystemDefaults: async (data: Partial<SystemDefaults>): Promise<SystemDefaults> => {
        const response = await axios.put(`${API_URL}/settings/defaults`, data, getAuthHeaders());
        return response.data;
    },
};
