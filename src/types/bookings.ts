// Booking Management Types

export type BookingStatus =
    | 'Token Paid'
    | 'Agreement Drafted'
    | 'Agreement Signed'
    | 'Part Payment'
    | 'Full Payment'
    | 'Registered'
    | 'Cancelled';

export type LeadSource =
    | 'Facebook'
    | 'Google Ads'
    | 'Website'
    | 'Referral'
    | 'Walk-in'
    | 'Other';

export type PaymentMode =
    | 'NEFT'
    | 'RTGS'
    | 'UPI'
    | 'Cheque'
    | 'Cash'
    | 'Other';

export type PaymentStatus = 'Pending' | 'Partially Paid' | 'Paid' | 'Overdue';

export type DocumentCategory =
    | 'KYC'
    | 'Booking Form'
    | 'Agreement Draft'
    | 'Signed Agreement'
    | 'Payment Receipts'
    | 'Registration Documents';

export interface Booking {
    id: string;
    customerName: string;
    phone: string;
    email: string;
    panNo: string;
    aadharNo: string;
    coApplicant?: string;
    address: string;
    city: string;
    state: string;
    leadSource: LeadSource;
    salesExecutive: string;
    projectId: string;
    projectName: string;
    category: string;
    inventoryId: string;
    plotNo: string;
    unitCost: number;
    discount: number;
    netAmount: number;
    bookingAmount: number;
    amountReceived: number;
    balance: number;
    status: BookingStatus;
    paymentPlanType: string;
    agreementTemplate: string;
    agreementDate: Date | null;
    registrationDate: Date | null;
    bookingDate: Date;
    createdAt: Date;
    cancellationReason?: string;
    refundAmount?: number;
}

export interface BookingFormData {
    // Step 1: Customer & Source
    leadId?: string;
    customerName: string;
    phone: string;
    email: string;
    panNo: string;
    aadharNo: string;
    coApplicant?: string;
    address: string;
    city: string;
    state: string;
    leadSource: LeadSource;
    salesExecutive: string;

    // Step 2: Project & Unit
    projectId: string;
    projectName: string;
    category: string;
    inventoryId: string;
    plotNo: string;

    // Step 3: Commercials
    unitCost: number;
    discount: number;
    netAmount: number;
    bookingAmount: number;
    paymentPlanType: string;
    paymentSchedule: PaymentScheduleItem[];
    agreementTemplate: string;
    agreementDate: Date | null;
}

export interface BookingFilters {
    project: string;
    category: string;
    status: string;
    sales: string;
    fromDate: string;
    toDate: string;
    search: string;
}

export interface BookingSummary {
    total: number;
    confirmed: number;
    pendingPayments: number;
    registered: number;
    cancelled: number;
}

export interface Payment {
    id: string;
    milestone: string;
    dueDate: Date;
    amount: number;
    paidAmount: number;
    status: PaymentStatus;
    paymentDate: Date | null;
    mode: PaymentMode;
    referenceNo: string;
}

export interface PaymentScheduleItem {
    milestone: string;
    dueDate: Date;
    amount: number;
}

export interface BookingDocument {
    id: string;
    name: string;
    category: DocumentCategory;
    size: string;
    uploadedBy: string;
    uploadedAt: Date;
}

export interface TimelineEntry {
    id: string;
    type: 'created' | 'status_change' | 'payment' | 'document' | 'note' | 'cancelled';
    description: string;
    createdBy: string;
    createdAt: Date;
}

export interface BookingListResponse {
    data: Booking[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
