// Site Visits Module Types

export type VisitStatus =
    | 'Scheduled'
    | 'Confirmed'
    | 'In Progress'
    | 'Completed'
    | 'No Show'
    | 'Rescheduled'
    | 'Converted to Booking'
    | 'Cancelled';

export type VisitMode = 'Onsite' | 'Google Meet' | 'Office Visit';

export type VisitOutcome =
    | 'Positive Response'
    | 'Interested'
    | 'Negotiation Required'
    | 'Follow-up Visit Needed'
    | 'Drop / Not Interested';

export interface SiteVisit {
    id: string;
    leadId: string;
    leadName: string;
    leadPhone: string;
    leadEmail: string;
    projectId: string;
    projectName: string;
    preferredPlot: string | null;
    visitDate: Date;
    visitTime: string;
    visitMode: VisitMode;
    assignedExecutive: string;
    assignedExecutiveId: string;
    status: VisitStatus;
    expectedOutcome: string;
    actualOutcome: VisitOutcome | null;
    followUpRequired: boolean;
    followUpDate: Date | null;
    notes: string;
    sendReminders: boolean;
    createdAt: Date;
    updatedAt: Date;
    timeline: VisitTimelineEntry[];
    attachments: VisitAttachment[];
}

export interface VisitTimelineEntry {
    id: string;
    action: string;
    user: string;
    timestamp: Date;
}

export interface VisitAttachment {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
    uploadedBy: string;
}

export interface VisitFilters {
    project?: string;
    status?: string;
    user?: string;
    fromDate?: string;
    toDate?: string;
    search?: string;
}

export interface VisitsResponse {
    data: SiteVisit[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    status: VisitStatus;
    leadName: string;
    projectName: string;
    assignedExecutive: string;
}
