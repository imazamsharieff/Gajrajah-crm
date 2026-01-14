export enum LeadStatus {
    NEW = 'New',
    FOLLOW_UP = 'Follow-Up',
    SITE_VISIT_SCHEDULED = 'Site Visit Scheduled',
    NEGOTIATION = 'Negotiation',
    BOOKING = 'Booking',
    REGISTRATION = 'Registration',
    CLOSED_WON = 'Closed/Won',
    LOST = 'Lost',
}

export enum LeadSource {
    FACEBOOK = 'Facebook',
    GOOGLE_ADS = 'Google Ads',
    WEBSITE = 'Website',
    REFERRAL = 'Referral',
    WALK_IN = 'Walk-in',
}

export enum ActivityType {
    CALL = 'Call',
    NOTE = 'Note',
    WHATSAPP = 'WhatsApp',
    EMAIL = 'Email',
    SITE_VISIT = 'Site Visit',
    FOLLOW_UP = 'Follow-up',
}

export interface Lead {
    id: string;
    name: string;
    phone: string;
    email: string;
    source: LeadSource;
    status: LeadStatus;
    assignedTo: string;
    projectsInterested: string[];
    notes: string;
    lastFollowUp: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Activity {
    id: string;
    leadId: string;
    type: ActivityType;
    description: string;
    createdBy: string;
    createdAt: Date;
}

export interface LeadFilters {
    search: string;
    status: LeadStatus | 'all';
    source: LeadSource | 'all';
    assignedTo: string | 'all';
    dateFrom: Date | null;
    dateTo: Date | null;
}

export interface PipelineStage {
    id: string;
    name: LeadStatus;
    order: number;
    color: string;
}

export interface LeadFormData {
    name: string;
    phone: string;
    email: string;
    source: LeadSource;
    status: LeadStatus;
    assignedTo: string;
    projectsInterested: string[];
    notes: string;
}
