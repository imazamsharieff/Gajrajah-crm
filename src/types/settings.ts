// Settings Module Types

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    designation: string;
    department: string;
    whatsapp: string;
    role: string;
    status: 'Active' | 'Disabled';
    avatar: string | null;
    signature: string | null;
    lastLogin: Date | null;
    createdAt: Date;
}

export interface User extends UserProfile { }

export interface Role {
    id: string;
    name: string;
    description: string;
    permissions: {
        [module: string]: {
            view: boolean;
            create: boolean;
            edit: boolean;
            delete: boolean;
            assign: boolean;
            export: boolean;
        };
    };
}

export interface AutomationRule {
    id: string;
    name: string;
    trigger: string;
    conditions: any;
    actions: Array<{ type: string; value: string }>;
    enabled: boolean;
    createdAt: Date;
}

export interface Integration {
    enabled: boolean;
    apiKey?: string;
    phoneNumber?: string;
    accessToken?: string;
    pageId?: string;
    senderId?: string;
    url?: string;
    events?: string[];
}

export interface Integrations {
    whatsapp: Integration;
    metaLeads: Integration;
    sms: Integration;
    webhooks: Integration;
}

export interface NotificationSettings {
    email: boolean;
    whatsapp: boolean;
    push: boolean;
    dailySummary: boolean;
    templates: {
        leadFollowUp: string;
        paymentAck: string;
        bookingConfirmation: string;
    };
}

export interface BrandingSettings {
    companyName: string;
    logo: string | null;
    favicon: string | null;
    themeMode: 'light' | 'dark';
    primaryColor: string;
}

export interface AuditLog {
    id: string;
    timestamp: Date;
    user: string;
    action: string;
    module: string;
    oldValue: string | null;
    newValue: string | null;
}

export interface AuditLogsResponse {
    data: AuditLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface BillingInfo {
    plan: string;
    storage: {
        used: number;
        total: number;
        unit: string;
    };
    users: {
        current: number;
        limit: number;
    };
    renewalDate: Date;
}

export interface SystemDefaults {
    defaultLeadStatus: string;
    defaultPaymentTerms: string;
    defaultCurrency: string;
    dateFormat: string;
    timezone: string;
}
