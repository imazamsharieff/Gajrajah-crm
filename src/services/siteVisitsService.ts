import axios from 'axios';
import type {
    SiteVisit,
    VisitsResponse,
    VisitFilters,
    CalendarEvent,
    VisitTimelineEntry,
    VisitAttachment,
} from '../types/siteVisits';

const API_URL = 'http://localhost:6061';

const getAuthHeaders = () => {
    const token = localStorage.getItem('crm_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const siteVisitsAPI = {
    // List visits
    getVisits: async (filters: VisitFilters, page: number = 1, limit: number = 10): Promise<VisitsResponse> => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const response = await axios.get(`${API_URL}/site-visits?${params}`, getAuthHeaders());
        return response.data;
    },

    // Create visit
    createVisit: async (data: Partial<SiteVisit>): Promise<SiteVisit> => {
        const response = await axios.post(`${API_URL}/site-visits`, data, getAuthHeaders());
        return response.data;
    },

    // Get visit details
    getVisit: async (id: string): Promise<SiteVisit> => {
        const response = await axios.get(`${API_URL}/site-visits/${id}`, getAuthHeaders());
        return response.data;
    },

    // Update visit
    updateVisit: async (id: string, data: Partial<SiteVisit>): Promise<SiteVisit> => {
        const response = await axios.put(`${API_URL}/site-visits/${id}`, data, getAuthHeaders());
        return response.data;
    },

    // Update status
    updateStatus: async (id: string, status: string, user?: string): Promise<SiteVisit> => {
        const response = await axios.patch(`${API_URL}/site-visits/${id}/status`, { status, user }, getAuthHeaders());
        return response.data;
    },

    // Reschedule visit
    rescheduleVisit: async (id: string, visitDate: string, visitTime: string, user?: string): Promise<SiteVisit> => {
        const response = await axios.patch(
            `${API_URL}/site-visits/${id}/reschedule`,
            { visitDate, visitTime, user },
            getAuthHeaders()
        );
        return response.data;
    },

    // Cancel visit
    cancelVisit: async (id: string, user?: string): Promise<any> => {
        const response = await axios.delete(`${API_URL}/site-visits/${id}`, {
            ...getAuthHeaders(),
            data: { user },
        });
        return response.data;
    },

    // Get calendar events
    getCalendarEvents: async (startDate: string, endDate: string): Promise<CalendarEvent[]> => {
        const response = await axios.get(
            `${API_URL}/site-visits/calendar?startDate=${startDate}&endDate=${endDate}`,
            getAuthHeaders()
        );
        return response.data;
    },

    // Log outcome
    logOutcome: async (
        id: string,
        outcome: string,
        notes: string,
        followUpRequired: boolean,
        followUpDate?: string,
        user?: string
    ): Promise<SiteVisit> => {
        const response = await axios.post(
            `${API_URL}/site-visits/${id}/outcome`,
            { outcome, notes, followUpRequired, followUpDate, user },
            getAuthHeaders()
        );
        return response.data;
    },

    // Get timeline
    getTimeline: async (id: string): Promise<VisitTimelineEntry[]> => {
        const response = await axios.get(`${API_URL}/site-visits/${id}/timeline`, getAuthHeaders());
        return response.data;
    },

    // Get files
    getFiles: async (id: string): Promise<VisitAttachment[]> => {
        const response = await axios.get(`${API_URL}/site-visits/${id}/files`, getAuthHeaders());
        return response.data;
    },

    // Upload file
    uploadFile: async (id: string, name: string, type: string, url: string, user?: string): Promise<VisitAttachment> => {
        const response = await axios.post(
            `${API_URL}/site-visits/${id}/files`,
            { name, type, url, user },
            getAuthHeaders()
        );
        return response.data;
    },

    // Delete file
    deleteFile: async (id: string, fileId: string): Promise<void> => {
        await axios.delete(`${API_URL}/site-visits/${id}/files/${fileId}`, getAuthHeaders());
    },

    // Export visits
    exportVisits: async (format: string, filters: VisitFilters): Promise<any> => {
        const response = await axios.post(`${API_URL}/site-visits/export`, { format, filters }, getAuthHeaders());
        return response.data;
    },

    // Email report
    emailReport: async (recipients: string[], format: string): Promise<any> => {
        const response = await axios.post(`${API_URL}/site-visits/email`, { recipients, format }, getAuthHeaders());
        return response.data;
    },
};
