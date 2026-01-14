export enum ProjectCategory {
    RESIDENTIAL = 'Residential',
    INDUSTRIAL = 'Industrial',
    FARM_LAND = 'Farm Land',
}

export enum ProjectStatus {
    ACTIVE = 'Active',
    LAUNCHING_SOON = 'Launching Soon',
    SOLD_OUT = 'Sold Out',
    ON_HOLD = 'On Hold',
}

export enum InventoryStatus {
    AVAILABLE = 'Available',
    SOLD = 'Sold',
    BLOCKED = 'Blocked',
}

export interface Project {
    id: string;
    name: string;
    category: ProjectCategory;
    description: string;
    reraStatus: boolean;
    reraNo: string;
    address: string;
    city: string;
    state: string;
    landmark: string;
    mapsUrl: string;
    totalUnits: number;
    availableUnits: number;
    smartInventory: boolean;
    status: ProjectStatus;
    assignedManager: string;
    tags: string[];
    createdAt: Date | string;
}

export interface ProjectFormData {
    name: string;
    category: ProjectCategory;
    description: string;
    reraStatus: boolean;
    reraNo: string;
    address: string;
    city: string;
    state: string;
    landmark: string;
    mapsUrl: string;
    totalUnits: number;
    availableUnits: number;
    smartInventory: boolean;
    status: ProjectStatus;
    assignedManager: string;
    tags: string[];
}

export interface ProjectFilters {
    category: ProjectCategory | 'All';
    status: ProjectStatus | 'All';
    city: string | 'All';
    manager: string | 'All';
    search: string;
}

export interface ProjectSummary {
    residentialCount: number;
    industrialCount: number;
    farmlandCount: number;
}

export interface InventoryUnit {
    id: string;
    unitNo: string;
    size: string;
    facing: string;
    status: InventoryStatus;
}

export interface ProjectFile {
    id: string;
    name: string;
    size: string;
    uploadedBy: string;
    uploadedAt: Date | string;
}

export interface ProjectActivity {
    id: string;
    type: string;
    description: string;
    createdBy: string;
    createdAt: Date | string;
}

export interface Manager {
    id: string;
    name: string;
    role: string;
}

export interface ProjectsListResponse {
    projects: Project[];
    total: number;
    page: number;
    totalPages: number;
}
