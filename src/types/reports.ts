// Reports & Analytics Types

export interface OverviewReport {
    totalLeads: number;
    totalProjects: number;
    totalUnits: number;
    availableUnits: number;
    totalBookings: number;
    revenueCollected: number;
    revenuePending: number;
}

export interface SalesFunnelStage {
    name: string;
    value: number;
}

export interface SalesFunnel {
    stages: SalesFunnelStage[];
}

export interface LeadSourceData {
    name: string;
    value: number;
}

export interface MonthlySalesData {
    month: string;
    revenue: number;
}

export interface LeadsReportMetrics {
    totalLeads: number;
    converted: number;
    conversionRate: number;
}

export interface InventoryReportMetrics {
    total: number;
    available: number;
    sold: number;
    reserved: number;
    blocked: number;
    soldPercentage: string;
}

export interface BookingsReportMetrics {
    totalBookings: number;
    registered: number;
    cancelled: number;
    avgBookingValue: number;
    conversionRate: string;
}

export interface PaymentsReportMetrics {
    totalRevenue: number;
    collected: number;
    pending: number;
    overdue: number;
    collectionRate: string;
}

export interface UserPerformance {
    id: string;
    name: string;
    role: string;
    leadsAssigned: number;
    leadsConverted: number;
    bookings: number;
    revenue: number;
    conversionRate: string;
}

export interface ScheduledReport {
    id: string;
    name: string;
    reportType: string;
    frequency: 'Daily' | 'Weekly' | 'Monthly';
    deliveryFormat: 'PDF' | 'Excel' | 'CSV';
    deliveryTime: string;
    recipients: string[];
    enabled: boolean;
    filters: any;
    createdAt: Date;
}

export interface ReportFilters {
    project?: string;
    category?: string;
    status?: string;
    source?: string;
    assignedTo?: string;
    fromDate?: string;
    toDate?: string;
}
