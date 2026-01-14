import axios from 'axios';
import type {
    Booking,
    BookingFilters,
    BookingSummary,
    BookingListResponse,
    Payment,
    BookingDocument,
    TimelineEntry,
    BookingFormData,
} from '../types/bookings';

const API_URL = 'http://localhost:6061';

const getAuthHeaders = () => {
    const token = localStorage.getItem('crm_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const bookingsAPI = {
    // Get bookings with filters
    getBookings: async (
        filters: BookingFilters,
        page: number = 1,
        limit: number = 10,
        sortBy: string = 'bookingDate',
        sortOrder: string = 'desc'
    ): Promise<BookingListResponse> => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            sortBy,
            sortOrder,
        });

        if (filters.project && filters.project !== 'All') params.append('project', filters.project);
        if (filters.category && filters.category !== 'All') params.append('category', filters.category);
        if (filters.status && filters.status !== 'All') params.append('status', filters.status);
        if (filters.sales && filters.sales !== 'All') params.append('sales', filters.sales);
        if (filters.fromDate) params.append('fromDate', filters.fromDate);
        if (filters.toDate) params.append('toDate', filters.toDate);
        if (filters.search) params.append('search', filters.search);

        const response = await axios.get(`${API_URL}/bookings?${params}`, getAuthHeaders());
        return response.data;
    },

    // Get summary stats
    getSummary: async (): Promise<BookingSummary> => {
        const response = await axios.get(`${API_URL}/bookings/summary`, getAuthHeaders());
        return response.data;
    },

    // Get single booking
    getBooking: async (id: string): Promise<Booking> => {
        const response = await axios.get(`${API_URL}/bookings/${id}`, getAuthHeaders());
        return response.data;
    },

    // Create booking
    createBooking: async (data: BookingFormData): Promise<Booking> => {
        const response = await axios.post(`${API_URL}/bookings`, data, getAuthHeaders());
        return response.data;
    },

    // Update status
    updateStatus: async (id: string, status: string): Promise<Booking> => {
        const response = await axios.patch(
            `${API_URL}/bookings/${id}/status`,
            { status },
            getAuthHeaders()
        );
        return response.data;
    },

    // Cancel booking
    cancelBooking: async (id: string, reason: string, refundAmount: number): Promise<Booking> => {
        const response = await axios.patch(
            `${API_URL}/bookings/${id}/cancel`,
            { reason, refundAmount },
            getAuthHeaders()
        );
        return response.data;
    },

    // Get payments
    getPayments: async (id: string): Promise<Payment[]> => {
        const response = await axios.get(`${API_URL}/bookings/${id}/payments`, getAuthHeaders());
        return response.data;
    },

    // Add payment
    addPayment: async (id: string, payment: Partial<Payment>): Promise<Payment> => {
        const response = await axios.post(
            `${API_URL}/bookings/${id}/payments`,
            payment,
            getAuthHeaders()
        );
        return response.data;
    },

    // Get documents
    getDocuments: async (id: string): Promise<BookingDocument[]> => {
        const response = await axios.get(`${API_URL}/bookings/${id}/files`, getAuthHeaders());
        return response.data;
    },

    // Upload document
    uploadDocument: async (id: string, document: Partial<BookingDocument>): Promise<BookingDocument> => {
        const response = await axios.post(
            `${API_URL}/bookings/${id}/files`,
            document,
            getAuthHeaders()
        );
        return response.data;
    },

    // Delete document
    deleteDocument: async (id: string, fileId: string): Promise<void> => {
        await axios.delete(`${API_URL}/bookings/${id}/files/${fileId}`, getAuthHeaders());
    },

    // Get timeline
    getTimeline: async (id: string): Promise<TimelineEntry[]> => {
        const response = await axios.get(`${API_URL}/bookings/${id}/timeline`, getAuthHeaders());
        return response.data;
    },

    // Add timeline entry
    addTimelineEntry: async (id: string, entry: Partial<TimelineEntry>): Promise<TimelineEntry> => {
        const response = await axios.post(
            `${API_URL}/bookings/${id}/timeline`,
            entry,
            getAuthHeaders()
        );
        return response.data;
    },
};
