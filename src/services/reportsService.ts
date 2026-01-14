import axios from 'axios';
import type {
    OverviewReport,
    SalesFunnel,
    LeadSourceData,
    MonthlySalesData,
    UserPerformance,
    ScheduledReport,
    ReportFilters,
} from '../types/reports';

const API_URL = 'http://localhost:6061';

const getAuthHeaders = () => {
    const token = localStorage.getItem('crm_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const reportsAPI = {
    // Overview
    getOverview: async (): Promise<OverviewReport> => {
        const response = await axios.get(`${API_URL}/reports/overview`, getAuthHeaders());
        return response.data;
    },

    getSalesFunnel: async (): Promise<SalesFunnel> => {
        const response = await axios.get(`${API_URL}/reports/sales-funnel`, getAuthHeaders());
        return response.data;
    },

    getLeadsBySource: async (): Promise<LeadSourceData[]> => {
        const response = await axios.get(`${API_URL}/reports/leads-by-source`, getAuthHeaders());
        return response.data;
    },

    getMonthlySales: async (): Promise<MonthlySalesData[]> => {
        const response = await axios.get(`${API_URL}/reports/monthly-sales`, getAuthHeaders());
        return response.data;
    },

    // Detailed Reports
    getLeadsReport: async (filters: ReportFilters): Promise<any> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const response = await axios.get(`${API_URL}/reports/leads?${params}`, getAuthHeaders());
        return response.data;
    },

    getInventoryReport: async (filters: ReportFilters): Promise<any> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const response = await axios.get(`${API_URL}/reports/inventory?${params}`, getAuthHeaders());
        return response.data;
    },

    getBookingsReport: async (filters: ReportFilters): Promise<any> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const response = await axios.get(`${API_URL}/reports/bookings?${params}`, getAuthHeaders());
        return response.data;
    },

    getPaymentsReport: async (filters: ReportFilters): Promise<any> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const response = await axios.get(`${API_URL}/reports/payments?${params}`, getAuthHeaders());
        return response.data;
    },

    getUserPerformance: async (): Promise<UserPerformance[]> => {
        const response = await axios.get(`${API_URL}/reports/users`, getAuthHeaders());
        return response.data;
    },

    // Scheduled Reports
    getScheduledReports: async (): Promise<ScheduledReport[]> => {
        const response = await axios.get(`${API_URL}/reports/scheduled`, getAuthHeaders());
        return response.data;
    },

    createScheduledReport: async (data: Partial<ScheduledReport>): Promise<ScheduledReport> => {
        const response = await axios.post(`${API_URL}/reports/scheduled`, data, getAuthHeaders());
        return response.data;
    },

    updateScheduledReport: async (id: string, data: Partial<ScheduledReport>): Promise<ScheduledReport> => {
        const response = await axios.put(`${API_URL}/reports/scheduled/${id}`, data, getAuthHeaders());
        return response.data;
    },

    deleteScheduledReport: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/reports/scheduled/${id}`, getAuthHeaders());
    },

    // Export & Email
    exportReport: async (reportType: string, format: string, filters: any): Promise<any> => {
        const response = await axios.post(
            `${API_URL}/reports/export`,
            { reportType, format, filters },
            getAuthHeaders()
        );
        return response.data;
    },

    emailReport: async (reportType: string, recipients: string[], format: string): Promise<any> => {
        const response = await axios.post(
            `${API_URL}/reports/email`,
            { reportType, recipients, format },
            getAuthHeaders()
        );
        return response.data;
    },
};
