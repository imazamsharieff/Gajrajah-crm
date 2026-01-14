export enum InventoryStatus {
    AVAILABLE = 'Available',
    SOLD = 'Sold',
    RESERVED = 'Reserved',
    BLOCKED = 'Blocked',
}

export enum InventoryFacing {
    NORTH = 'North',
    SOUTH = 'South',
    EAST = 'East',
    WEST = 'West',
    CORNER = 'Corner',
}

export interface Inventory {
    id: string;
    plotNo: string;
    projectId: string;
    projectName: string;
    dimensionNS: number;
    dimensionEW: number;
    size: number;
    facing: InventoryFacing;
    status: InventoryStatus;
    price: number;
    notes: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface InventoryFormData {
    plotNo: string;
    projectId: string;
    projectName: string;
    dimensionNS: number;
    dimensionEW: number;
    facing: InventoryFacing;
    status: InventoryStatus;
    price: number;
    notes: string;
}

export interface InventoryFilters {
    project: string;
    status: InventoryStatus | 'All';
    facing: InventoryFacing | 'All';
    search: string;
    minSize: string;
    maxSize: string;
}

export interface InventorySummary {
    total: number;
    available: number;
    sold: number;
    reserved: number;
    blocked: number;
}

export interface InventoryHistory {
    id: string;
    type: string;
    description: string;
    createdBy: string;
    createdAt: Date | string;
}

export interface InventoryFile {
    id: string;
    name: string;
    size: string;
    uploadedBy: string;
    uploadedAt: Date | string;
}

export interface InventoryListResponse {
    inventory: Inventory[];
    total: number;
    page: number;
    totalPages: number;
}

export interface ProjectInventorySummary {
    project_id: string;
    project_name: string;
    category: string;
    available: number;
    booked: number;
    registered: number;
}

