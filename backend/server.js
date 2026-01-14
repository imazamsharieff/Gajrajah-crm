const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 6061;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'GAJRAJAH CRM Backend is running', version: '1.0.0' });
});

// Auth middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !token.startsWith('mock_jwt_token')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Mock data
let projects = [
    {
        id: 'proj-1',
        name: 'Gajrajah Heights',
        category: 'Residential',
        description: 'Premium residential apartments with modern amenities',
        reraStatus: true,
        reraNo: 'KA/RERA/2023/001',
        address: '123 MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        landmark: 'Near Metro Station',
        mapsUrl: 'https://maps.google.com',
        totalUnits: 120,
        availableUnits: 45,
        smartInventory: true,
        status: 'Active',
        assignedManager: 'Rajesh Kumar',
        tags: ['Premium', '2BHK', '3BHK'],
        createdAt: new Date('2024-01-15'),
    },
    {
        id: 'proj-2',
        name: 'Gajrajah Industrial Park',
        category: 'Industrial',
        description: 'Modern industrial warehouses and manufacturing units',
        reraStatus: true,
        reraNo: 'KA/RERA/2023/002',
        address: '456 Hosur Road',
        city: 'Bangalore',
        state: 'Karnataka',
        landmark: 'Electronic City',
        mapsUrl: 'https://maps.google.com',
        totalUnits: 25,
        availableUnits: 8,
        smartInventory: true,
        status: 'Active',
        assignedManager: 'Priya Sharma',
        tags: ['Warehouse', 'Manufacturing'],
        createdAt: new Date('2024-02-20'),
    },
    {
        id: 'proj-3',
        name: 'Gajrajah Farm Estates',
        category: 'Farm Land',
        description: 'Agricultural land plots with water facility',
        reraStatus: false,
        reraNo: '',
        address: 'Kanakapura Road',
        city: 'Bangalore',
        state: 'Karnataka',
        landmark: 'Near NH 209',
        mapsUrl: 'https://maps.google.com',
        totalUnits: 50,
        availableUnits: 32,
        smartInventory: false,
        status: 'Active',
        assignedManager: 'Amit Patel',
        tags: ['Agriculture', 'Investment'],
        createdAt: new Date('2024-03-10'),
    },
    {
        id: 'proj-4',
        name: 'Gajrajah Residency',
        category: 'Residential',
        description: 'Affordable housing project',
        reraStatus: true,
        reraNo: 'KA/RERA/2023/003',
        address: '789 Whitefield',
        city: 'Bangalore',
        state: 'Karnataka',
        landmark: 'ITPL Main Road',
        mapsUrl: 'https://maps.google.com',
        totalUnits: 200,
        availableUnits: 0,
        smartInventory: true,
        status: 'Sold Out',
        assignedManager: 'Sneha Reddy',
        tags: ['Affordable', '1BHK', '2BHK'],
        createdAt: new Date('2023-11-05'),
    },
    {
        id: 'proj-5',
        name: 'Gajrajah Tech Hub',
        category: 'Industrial',
        description: 'IT office spaces and co-working areas',
        reraStatus: true,
        reraNo: 'KA/RERA/2024/001',
        address: 'Outer Ring Road',
        city: 'Bangalore',
        state: 'Karnataka',
        landmark: 'Marathahalli',
        mapsUrl: 'https://maps.google.com',
        totalUnits: 40,
        availableUnits: 15,
        smartInventory: true,
        status: 'Launching Soon',
        assignedManager: 'Rajesh Kumar',
        tags: ['IT Park', 'Office Space'],
        createdAt: new Date('2024-04-01'),
    },
];

// Mock users data
const mockUsers = [
    {
        id: 'user-1',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@gajrajah.com',
        phone: '+91-9876543210',
        role: 'Manager',
        status: 'Active',
        department: 'Sales',
        joinDate: new Date('2023-01-15'),
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2024-11-20'),
    },
    {
        id: 'user-2',
        name: 'Priya Sharma',
        email: 'priya.sharma@gajrajah.com',
        phone: '+91-9876543211',
        role: 'BDM',
        status: 'Active',
        department: 'Business Development',
        joinDate: new Date('2023-03-20'),
        createdAt: new Date('2023-03-20'),
        updatedAt: new Date('2024-11-20'),
    },
    {
        id: 'user-3',
        name: 'Amit Patel',
        email: 'amit.patel@gajrajah.com',
        phone: '+91-9876543212',
        role: 'Sales',
        status: 'Active',
        department: 'Sales',
        joinDate: new Date('2023-06-10'),
        createdAt: new Date('2023-06-10'),
        updatedAt: new Date('2024-11-20'),
    },
    {
        id: 'user-4',
        name: 'Sneha Reddy',
        email: 'sneha.reddy@gajrajah.com',
        phone: '+91-9876543213',
        role: 'Pre-Sales',
        status: 'Active',
        department: 'Pre-Sales',
        joinDate: new Date('2023-08-05'),
        createdAt: new Date('2023-08-05'),
        updatedAt: new Date('2024-11-20'),
    },
    {
        id: 'user-5',
        name: 'Vikram Singh',
        email: 'vikram.singh@gajrajah.com',
        phone: '+91-9876543214',
        role: 'Executive',
        status: 'Active',
        department: 'Operations',
        joinDate: new Date('2024-01-10'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-11-20'),
    },
    {
        id: 'user-6',
        name: 'Kavita Desai',
        email: 'kavita.desai@gajrajah.com',
        phone: '+91-9876543215',
        role: 'Telecaller',
        status: 'Active',
        department: 'Telecalling',
        joinDate: new Date('2024-03-15'),
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-11-20'),
    },
    {
        id: 'user-7',
        name: 'Rahul Mehta',
        email: 'rahul.mehta@gajrajah.com',
        phone: '+91-9876543216',
        role: 'Sales',
        status: 'Inactive',
        department: 'Sales',
        joinDate: new Date('2023-11-20'),
        createdAt: new Date('2023-11-20'),
        updatedAt: new Date('2024-11-20'),
    },
];

const simpleRoles = ['Pre-Sales', 'Telecaller', 'Sales', 'Executive', 'BDM', 'Manager'];

// Mock leads data
let leads = [
    {
        id: 'lead-1',
        name: 'Amit Sharma',
        phone: '+91-9876543210',
        email: 'amit.sharma@example.com',
        source: 'Website',
        status: 'New',
        assignedTo: 'Rajesh Kumar',
        projectsInterested: ['Gajrajah Heights'],
        notes: 'Interested in 2BHK apartment. Budget: 50-60L.',
        lastFollowUp: null,
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-11-01'),
    },
    {
        id: 'lead-2',
        name: 'Priya Patel',
        phone: '+91-9876543211',
        email: 'priya.patel@example.com',
        source: 'Referral',
        status: 'Follow-Up',
        assignedTo: 'Priya Sharma',
        projectsInterested: ['Gajrajah Heights', 'Gajrajah Residency'],
        notes: 'Looking for investment property.',
        lastFollowUp: new Date('2024-11-10'),
        createdAt: new Date('2024-11-05'),
        updatedAt: new Date('2024-11-10'),
    },
    {
        id: 'lead-3',
        name: 'Rahul Verma',
        phone: '+91-9876543212',
        email: 'rahul.verma@example.com',
        source: 'Facebook',
        status: 'Site Visit Scheduled',
        assignedTo: 'Rajesh Kumar',
        projectsInterested: ['Gajrajah Tech Hub'],
        notes: 'Needs office space for startup.',
        lastFollowUp: new Date('2024-11-12'),
        createdAt: new Date('2024-11-10'),
        updatedAt: new Date('2024-11-12'),
    },
    {
        id: 'lead-4',
        name: 'Sneha Reddy',
        phone: '+91-9876543213',
        email: 'sneha.reddy@example.com',
        source: 'Google Ads',
        status: 'Negotiation',
        assignedTo: 'Priya Sharma',
        projectsInterested: ['Gajrajah Farm Estates'],
        notes: 'Interested in farm land for agriculture.',
        lastFollowUp: new Date('2024-11-18'),
        createdAt: new Date('2024-11-15'),
        updatedAt: new Date('2024-11-18'),
    },
    {
        id: 'lead-5',
        name: 'Vikram Singh',
        phone: '+91-9876543214',
        email: 'vikram.singh@example.com',
        source: 'Walk-in',
        status: 'New',
        assignedTo: 'Rajesh Kumar',
        projectsInterested: ['Gajrajah Industrial Park'],
        notes: '',
        lastFollowUp: null,
        createdAt: new Date('2024-11-20'),
        updatedAt: new Date('2024-11-20'),
    },
];

let leadActivities = {};
let activities = {};
let files = {};

// Initialize lead activities
leads.forEach(lead => {
    leadActivities[lead.id] = [
        {
            id: `activity-${lead.id}-1`,
            leadId: lead.id,
            type: 'Note',
            description: 'Lead created',
            createdBy: lead.assignedTo,
            createdAt: lead.createdAt,
        },
    ];
});
let inventory = {};

// Initialize activities and inventory for existing projects
projects.forEach(proj => {
    activities[proj.id] = [
        {
            id: `act-${proj.id}-1`,
            type: 'status_change',
            description: `Project status set to ${proj.status}`,
            createdBy: proj.assignedManager,
            createdAt: new Date(proj.createdAt.getTime() + 86400000),
        },
    ];

    files[proj.id] = [
        {
            id: `file-${proj.id}-1`,
            name: 'Project Brochure.pdf',
            size: '2.5 MB',
            uploadedBy: proj.assignedManager,
            uploadedAt: new Date(proj.createdAt.getTime() + 172800000),
        },
    ];

    // Generate inventory
    const units = [];
    for (let i = 1; i <= Math.min(proj.totalUnits, 20); i++) {
        units.push({
            id: `unit-${proj.id}-${i}`,
            unitNo: `${proj.category === 'Farm Land' ? 'Plot' : 'Unit'} ${i}`,
            size: proj.category === 'Farm Land' ? `${Math.floor(Math.random() * 5000) + 1000} sqft` : `${Math.floor(Math.random() * 1000) + 500} sqft`,
            facing: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)],
            status: i <= proj.availableUnits ? 'Available' : (Math.random() > 0.5 ? 'Sold' : 'Blocked'),
        });
    }
    inventory[proj.id] = units;
});

// Routes

// GET /projects - List projects with filters
app.get('/projects', authMiddleware, (req, res) => {
    const { category, status, city, manager, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    let filtered = [...projects];

    // Apply filters
    if (category && category !== 'All') {
        filtered = filtered.filter(p => p.category === category);
    }
    if (status && status !== 'All') {
        filtered = filtered.filter(p => p.status === status);
    }
    if (city && city !== 'All') {
        filtered = filtered.filter(p => p.city === city);
    }
    if (manager && manager !== 'All') {
        filtered = filtered.filter(p => p.assignedManager === manager);
    }
    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.city.toLowerCase().includes(searchLower) ||
            p.category.toLowerCase().includes(searchLower)
        );
    }

    // Sort
    filtered.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        if (sortBy === 'createdAt') {
            aVal = new Date(aVal).getTime();
            bVal = new Date(bVal).getTime();
        }

        if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProjects = filtered.slice(startIndex, endIndex);

    res.json({
        projects: paginatedProjects,
        total: filtered.length,
        page: parseInt(page),
        totalPages: Math.ceil(filtered.length / limit),
    });
});

// GET /projects/summary - Category summary
app.get('/projects/summary', authMiddleware, (req, res) => {
    const summary = {
        residentialCount: projects.filter(p => p.category === 'Residential').length,
        industrialCount: projects.filter(p => p.category === 'Industrial').length,
        farmlandCount: projects.filter(p => p.category === 'Farm Land').length,
    };
    res.json(summary);
});

// GET /projects/:id - Get single project
app.get('/projects/:id', authMiddleware, (req, res) => {
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
});

// POST /projects - Create project
app.post('/projects', authMiddleware, (req, res) => {
    const newProject = {
        id: `proj-${Date.now()}`,
        ...req.body,
        createdAt: new Date(),
    };

    projects.unshift(newProject);
    activities[newProject.id] = [{
        id: `act-${newProject.id}-1`,
        type: 'created',
        description: 'Project created',
        createdBy: newProject.assignedManager,
        createdAt: new Date(),
    }];
    files[newProject.id] = [];
    inventory[newProject.id] = [];

    res.status(201).json(newProject);
});

// PUT /projects/:id - Update project
app.put('/projects/:id', authMiddleware, (req, res) => {
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Project not found' });
    }

    projects[index] = {
        ...projects[index],
        ...req.body,
    };

    activities[req.params.id].unshift({
        id: `act-${req.params.id}-${Date.now()}`,
        type: 'updated',
        description: 'Project details updated',
        createdBy: projects[index].assignedManager,
        createdAt: new Date(),
    });

    res.json(projects[index]);
});

// PATCH /projects/:id/status - Update status
app.patch('/projects/:id/status', authMiddleware, (req, res) => {
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Project not found' });
    }

    const oldStatus = projects[index].status;
    projects[index].status = req.body.status;

    activities[req.params.id].unshift({
        id: `act-${req.params.id}-${Date.now()}`,
        type: 'status_change',
        description: `Status changed from "${oldStatus}" to "${req.body.status}"`,
        createdBy: projects[index].assignedManager,
        createdAt: new Date(),
    });

    res.json(projects[index]);
});

// DELETE /projects/:id - Delete project
app.delete('/projects/:id', authMiddleware, (req, res) => {
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Project not found' });
    }

    projects.splice(index, 1);
    delete activities[req.params.id];
    delete files[req.params.id];
    delete inventory[req.params.id];

    res.json({ message: 'Project deleted successfully' });
});

// GET /projects/:id/inventory - Get inventory
app.get('/projects/:id/inventory', authMiddleware, (req, res) => {
    const { facing, status } = req.query;
    let units = inventory[req.params.id] || [];

    if (facing && facing !== 'All') {
        units = units.filter(u => u.facing === facing);
    }
    if (status && status !== 'All') {
        units = units.filter(u => u.status === status);
    }

    res.json(units);
});

// GET /projects/:id/inventory/summary - Inventory summary
app.get('/projects/:id/inventory/summary', authMiddleware, (req, res) => {
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
        total: project.totalUnits,
        available: project.availableUnits,
        sold: project.totalUnits - project.availableUnits,
    });
});

// GET /projects/:id/files - Get files
app.get('/projects/:id/files', authMiddleware, (req, res) => {
    res.json(files[req.params.id] || []);
});

// POST /projects/:id/files - Upload file
app.post('/projects/:id/files', authMiddleware, (req, res) => {
    const newFile = {
        id: `file-${req.params.id}-${Date.now()}`,
        ...req.body,
        uploadedAt: new Date(),
    };

    if (!files[req.params.id]) {
        files[req.params.id] = [];
    }
    files[req.params.id].unshift(newFile);

    res.status(201).json(newFile);
});

// DELETE /projects/:id/files/:fileId - Delete file
app.delete('/projects/:id/files/:fileId', authMiddleware, (req, res) => {
    if (!files[req.params.id]) {
        return res.status(404).json({ error: 'Project not found' });
    }

    const index = files[req.params.id].findIndex(f => f.id === req.params.fileId);
    if (index === -1) {
        return res.status(404).json({ error: 'File not found' });
    }

    files[req.params.id].splice(index, 1);
    res.json({ message: 'File deleted successfully' });
});

// GET /projects/:id/activity - Get activity
app.get('/projects/:id/activity', authMiddleware, (req, res) => {
    res.json(activities[req.params.id] || []);
});

// POST /projects/:id/activity - Add activity
app.post('/projects/:id/activity', authMiddleware, (req, res) => {
    const newActivity = {
        id: `act-${req.params.id}-${Date.now()}`,
        ...req.body,
        createdAt: new Date(),
    };

    if (!activities[req.params.id]) {
        activities[req.params.id] = [];
    }
    activities[req.params.id].unshift(newActivity);

    res.status(201).json(newActivity);
});

// Duplicate /users endpoint removed

// GET /cities - Get unique cities
app.get('/cities', authMiddleware, (req, res) => {
    const cities = [...new Set(projects.map(p => p.city))];
    res.json(cities);
});

// ==========================================
// LEADS ENDPOINTS
// ==========================================

// GET /leads - List leads with filters
app.get('/leads', authMiddleware, (req, res) => {
    const { search, status, source, assignedTo, dateFrom, dateTo, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    let filtered = [...leads];

    // Apply filters
    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(lead =>
            lead.name.toLowerCase().includes(searchLower) ||
            lead.phone.includes(searchLower) ||
            lead.email.toLowerCase().includes(searchLower) ||
            lead.source.toLowerCase().includes(searchLower)
        );
    }

    if (status && status !== 'all') {
        filtered = filtered.filter(lead => lead.status === status);
    }

    if (source && source !== 'all') {
        filtered = filtered.filter(lead => lead.source === source);
    }

    if (assignedTo && assignedTo !== 'all') {
        filtered = filtered.filter(lead => lead.assignedTo === assignedTo);
    }

    if (dateFrom) {
        filtered = filtered.filter(lead => new Date(lead.createdAt) >= new Date(dateFrom));
    }

    if (dateTo) {
        filtered = filtered.filter(lead => new Date(lead.createdAt) <= new Date(dateTo));
    }

    // Sort
    filtered.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'lastFollowUp') {
            aVal = aVal ? new Date(aVal).getTime() : 0;
            bVal = bVal ? new Date(bVal).getTime() : 0;
        }

        if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedLeads = filtered.slice(startIndex, endIndex);

    res.json({
        leads: paginatedLeads,
        total: filtered.length,
        page: parseInt(page),
        totalPages: Math.ceil(filtered.length / limit),
    });
});

// GET /leads/:id - Get single lead
app.get('/leads/:id', authMiddleware, (req, res) => {
    const lead = leads.find(l => l.id === req.params.id);
    if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(lead);
});

// POST /leads - Create lead
app.post('/leads', authMiddleware, (req, res) => {
    const newLead = {
        id: `lead-${Date.now()}`,
        ...req.body,
        lastFollowUp: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    leads.unshift(newLead);

    // Initialize activities for new lead
    leadActivities[newLead.id] = [{
        id: `activity-${newLead.id}-1`,
        leadId: newLead.id,
        type: 'Note',
        description: 'Lead created',
        createdBy: newLead.assignedTo,
        createdAt: new Date(),
    }];

    res.status(201).json(newLead);
});

// PUT /leads/:id - Update lead
app.put('/leads/:id', authMiddleware, (req, res) => {
    const index = leads.findIndex(l => l.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Lead not found' });
    }

    leads[index] = {
        ...leads[index],
        ...req.body,
        updatedAt: new Date(),
    };

    // Log update activity
    if (!leadActivities[req.params.id]) {
        leadActivities[req.params.id] = [];
    }
    leadActivities[req.params.id].unshift({
        id: `activity-${req.params.id}-${Date.now()}`,
        leadId: req.params.id,
        type: 'Note',
        description: 'Lead details updated',
        createdBy: leads[index].assignedTo,
        createdAt: new Date(),
    });

    res.json(leads[index]);
});

// DELETE /leads/:id - Delete lead
app.delete('/leads/:id', authMiddleware, (req, res) => {
    const index = leads.findIndex(l => l.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Lead not found' });
    }

    leads.splice(index, 1);
    delete leadActivities[req.params.id];

    res.json({ message: 'Lead deleted successfully' });
});

// PATCH /leads/:id/status - Update lead status
app.patch('/leads/:id/status', authMiddleware, (req, res) => {
    const index = leads.findIndex(l => l.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Lead not found' });
    }

    const oldStatus = leads[index].status;
    leads[index].status = req.body.status;
    leads[index].updatedAt = new Date();

    // Log status change
    if (!leadActivities[req.params.id]) {
        leadActivities[req.params.id] = [];
    }
    leadActivities[req.params.id].unshift({
        id: `activity-${req.params.id}-${Date.now()}`,
        leadId: req.params.id,
        type: 'Note',
        description: `Status changed from "${oldStatus}" to "${req.body.status}"`,
        createdBy: leads[index].assignedTo,
        createdAt: new Date(),
    });

    res.json(leads[index]);
});

// GET /leads/:id/activities - Get lead activities
app.get('/leads/:id/activities', authMiddleware, (req, res) => {
    const activities = leadActivities[req.params.id] || [];
    res.json(activities);
});

// POST /leads/:id/activities - Add activity
app.post('/leads/:id/activities', authMiddleware, (req, res) => {
    const lead = leads.find(l => l.id === req.params.id);
    if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
    }

    const newActivity = {
        id: `activity-${req.params.id}-${Date.now()}`,
        leadId: req.params.id,
        type: req.body.type,
        description: req.body.description,
        createdBy: req.body.createdBy,
        createdAt: new Date(),
    };

    if (!leadActivities[req.params.id]) {
        leadActivities[req.params.id] = [];
    }
    leadActivities[req.params.id].unshift(newActivity);

    // Auto-update lead status based on activity type
    const leadIndex = leads.findIndex(l => l.id === req.params.id);
    if (leadIndex !== -1) {
        if (req.body.type === 'Follow-up') {
            leads[leadIndex].status = 'Follow-Up';
            leads[leadIndex].lastFollowUp = new Date();
        } else if (req.body.type === 'Site Visit') {
            leads[leadIndex].status = 'Site Visit Scheduled';
        }
        leads[leadIndex].updatedAt = new Date();
    }

    res.status(201).json(newActivity);
});

// ==========================================
// INVENTORY ENDPOINTS
// ==========================================

// Generate sample inventory data
let inventoryItems = [];
let inventoryHistory = {};
let inventoryFiles = {};

// Create 40 inventory items across projects
const statuses = ['Available', 'Sold', 'Reserved', 'Blocked'];
const facings = ['North', 'South', 'East', 'West', 'Corner'];

projects.forEach((proj, projIndex) => {
    const itemsPerProject = projIndex === 0 ? 15 : projIndex === 1 ? 10 : projIndex === 2 ? 8 : 5;

    for (let i = 1; i <= itemsPerProject; i++) {
        const dimensionNS = Math.floor(Math.random() * 30) + 30; // 30-60 ft
        const dimensionEW = Math.floor(Math.random() * 30) + 30; // 30-60 ft
        const size = dimensionNS * dimensionEW;
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const facing = facings[Math.floor(Math.random() * facings.length)];
        const basePrice = proj.category === 'Farm Land' ? 2000000 : proj.category === 'Residential' ? 4500000 : 8000000;
        const price = basePrice + Math.floor(Math.random() * 2000000);

        const item = {
            id: `inv-${proj.id}-${i}`,
            plotNo: `${proj.category === 'Farm Land' ? 'P' : proj.category === 'Residential' ? 'A' : 'W'}${String(i).padStart(3, '0')}`,
            projectId: proj.id,
            projectName: proj.name,
            dimensionNS,
            dimensionEW,
            size,
            facing,
            status,
            price,
            notes: '',
            createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        };

        inventoryItems.push(item);

        // Initialize history
        inventoryHistory[item.id] = [
            {
                id: `hist-${item.id}-1`,
                type: 'created',
                description: 'Inventory item created',
                createdBy: 'Admin',
                createdAt: item.createdAt,
            },
            {
                id: `hist-${item.id}-2`,
                type: 'status_change',
                description: `Status set to ${status}`,
                createdBy: proj.assignedManager,
                createdAt: new Date(item.createdAt.getTime() + 86400000),
            },
        ];

        // Initialize files
        inventoryFiles[item.id] = [];
    }
});

// GET /inventory - List inventory with filters
app.get('/inventory', authMiddleware, (req, res) => {
    const { project, status, facing, search, minSize, maxSize, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    let filtered = [...inventoryItems];

    // Apply filters
    if (project && project !== 'All') {
        filtered = filtered.filter(item => item.projectId === project);
    }
    if (status && status !== 'All') {
        filtered = filtered.filter(item => item.status === status);
    }
    if (facing && facing !== 'All') {
        filtered = filtered.filter(item => item.facing === facing);
    }
    if (minSize) {
        filtered = filtered.filter(item => item.size >= parseInt(minSize));
    }
    if (maxSize) {
        filtered = filtered.filter(item => item.size <= parseInt(maxSize));
    }
    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(item =>
            item.plotNo.toLowerCase().includes(searchLower) ||
            item.projectName.toLowerCase().includes(searchLower) ||
            item.facing.toLowerCase().includes(searchLower) ||
            item.size.toString().includes(searchLower)
        );
    }

    // Sort
    filtered.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
            aVal = new Date(aVal).getTime();
            bVal = new Date(bVal).getTime();
        }

        if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedItems = filtered.slice(startIndex, endIndex);

    res.json({
        inventory: paginatedItems,
        total: filtered.length,
        page: parseInt(page),
        totalPages: Math.ceil(filtered.length / limit),
    });
});

// GET /inventory/summary - Summary stats
app.get('/inventory/summary', authMiddleware, (req, res) => {
    const summary = {
        total: inventoryItems.length,
        available: inventoryItems.filter(item => item.status === 'Available').length,
        sold: inventoryItems.filter(item => item.status === 'Sold').length,
        reserved: inventoryItems.filter(item => item.status === 'Reserved').length,
        blocked: inventoryItems.filter(item => item.status === 'Blocked').length,
    };
    res.json(summary);
});

// GET /inventory/project-summary - Project-level inventory summary
app.get('/inventory/project-summary', authMiddleware, (req, res) => {
    const projectSummaries = [];

    // Iterate through all projects to ensure all are shown
    projects.forEach(project => {
        const summary = {
            project_id: project.id,
            project_name: project.name,
            category: project.category,
            available: 0,
            booked: 0,
            registered: 0,
        };

        // Count inventory items for this project
        inventoryItems.forEach(item => {
            if (item.projectId === project.id) {
                // Status mapping
                if (item.status === 'Available') {
                    summary.available++;
                } else if (item.status === 'Reserved' || item.status === 'Booking Confirmed') {
                    summary.booked++;
                } else if (item.status === 'Sold') {
                    summary.registered++;
                }
            }
        });

        projectSummaries.push(summary);
    });

    res.json(projectSummaries);
});

// GET /inventory/map - Map view data
app.get('/inventory/map', authMiddleware, (req, res) => {
    const { project } = req.query;

    let filtered = [...inventoryItems];

    if (project && project !== 'All') {
        filtered = filtered.filter(item => item.projectId === project);
    }

    res.json(filtered);
});

// GET /inventory/:id - Get single inventory
app.get('/inventory/:id', authMiddleware, (req, res) => {
    const item = inventoryItems.find(i => i.id === req.params.id);
    if (!item) {
        return res.status(404).json({ error: 'Inventory not found' });
    }
    res.json(item);
});

// POST /inventory - Create inventory
app.post('/inventory', authMiddleware, (req, res) => {
    const newItem = {
        id: `inv-${Date.now()}`,
        ...req.body,
        size: req.body.dimensionNS * req.body.dimensionEW,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    inventoryItems.unshift(newItem);
    inventoryHistory[newItem.id] = [{
        id: `hist-${newItem.id}-1`,
        type: 'created',
        description: 'Inventory item created',
        createdBy: 'Admin',
        createdAt: new Date(),
    }];
    inventoryFiles[newItem.id] = [];

    res.status(201).json(newItem);
});

// PUT /inventory/:id - Update inventory
app.put('/inventory/:id', authMiddleware, (req, res) => {
    const index = inventoryItems.findIndex(i => i.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Inventory not found' });
    }

    const oldItem = { ...inventoryItems[index] };

    inventoryItems[index] = {
        ...inventoryItems[index],
        ...req.body,
        size: req.body.dimensionNS * req.body.dimensionEW,
        updatedAt: new Date(),
    };

    inventoryHistory[req.params.id].unshift({
        id: `hist-${req.params.id}-${Date.now()}`,
        type: 'updated',
        description: 'Inventory details updated',
        createdBy: 'Admin',
        createdAt: new Date(),
    });

    res.json(inventoryItems[index]);
});

// PATCH /inventory/:id - Partial update (inline editing)
app.patch('/inventory/:id', authMiddleware, (req, res) => {
    const index = inventoryItems.findIndex(i => i.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Inventory not found' });
    }

    const oldItem = { ...inventoryItems[index] };

    inventoryItems[index] = {
        ...inventoryItems[index],
        ...req.body,
        updatedAt: new Date(),
    };

    // Log specific changes
    let description = '';
    if (req.body.status && req.body.status !== oldItem.status) {
        description = `Status changed from "${oldItem.status}" to "${req.body.status}"`;
    } else if (req.body.price && req.body.price !== oldItem.price) {
        description = `Price updated from ₹${oldItem.price.toLocaleString('en-IN')} to ₹${req.body.price.toLocaleString('en-IN')}`;
    } else if (req.body.facing && req.body.facing !== oldItem.facing) {
        description = `Facing changed from "${oldItem.facing}" to "${req.body.facing}"`;
    } else {
        description = 'Inventory updated';
    }

    inventoryHistory[req.params.id].unshift({
        id: `hist-${req.params.id}-${Date.now()}`,
        type: req.body.status ? 'status_change' : 'updated',
        description,
        createdBy: 'Admin',
        createdAt: new Date(),
    });

    res.json(inventoryItems[index]);
});

// DELETE /inventory/:id - Delete inventory
app.delete('/inventory/:id', authMiddleware, (req, res) => {
    const index = inventoryItems.findIndex(i => i.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Inventory not found' });
    }

    inventoryItems.splice(index, 1);
    delete inventoryHistory[req.params.id];
    delete inventoryFiles[req.params.id];

    res.json({ message: 'Inventory deleted successfully' });
});

// GET /inventory/:id/history - Get history
app.get('/inventory/:id/history', authMiddleware, (req, res) => {
    res.json(inventoryHistory[req.params.id] || []);
});

// POST /inventory/:id/history - Add history entry
app.post('/inventory/:id/history', authMiddleware, (req, res) => {
    const newEntry = {
        id: `hist-${req.params.id}-${Date.now()}`,
        ...req.body,
        createdAt: new Date(),
    };

    if (!inventoryHistory[req.params.id]) {
        inventoryHistory[req.params.id] = [];
    }
    inventoryHistory[req.params.id].unshift(newEntry);

    res.status(201).json(newEntry);
});

// GET /inventory/:id/files - Get files
app.get('/inventory/:id/files', authMiddleware, (req, res) => {
    res.json(inventoryFiles[req.params.id] || []);
});

// POST /inventory/:id/files - Upload file
app.post('/inventory/:id/files', authMiddleware, (req, res) => {
    const newFile = {
        id: `file-${req.params.id}-${Date.now()}`,
        ...req.body,
        uploadedAt: new Date(),
    };

    if (!inventoryFiles[req.params.id]) {
        inventoryFiles[req.params.id] = [];
    }
    inventoryFiles[req.params.id].unshift(newFile);

    res.status(201).json(newFile);
});

// DELETE /inventory/:id/files/:fileId - Delete file
app.delete('/inventory/:id/files/:fileId', authMiddleware, (req, res) => {
    if (!inventoryFiles[req.params.id]) {
        return res.status(404).json({ error: 'Inventory not found' });
    }

    const index = inventoryFiles[req.params.id].findIndex(f => f.id === req.params.fileId);
    if (index === -1) {
        return res.status(404).json({ error: 'File not found' });
    }

    inventoryFiles[req.params.id].splice(index, 1);
    res.json({ message: 'File deleted successfully' });
});

// ==========================================
// BOOKING ENDPOINTS
// ==========================================

// Generate sample booking data
let bookings = [];
let bookingPayments = {};
let bookingDocuments = {};
let bookingTimeline = {};

// Create 25 sample bookings
const bookingStatuses = ['Token Paid', 'Agreement Drafted', 'Agreement Signed', 'Part Payment', 'Full Payment', 'Registered', 'Cancelled'];
const leadSources = ['Facebook', 'Google Ads', 'Website', 'Referral', 'Walk-in', 'Other'];
const salesExecutives = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy'];

projects.forEach((proj, projIndex) => {
    const bookingsPerProject = projIndex === 0 ? 8 : projIndex === 1 ? 6 : projIndex === 2 ? 5 : 3;

    for (let i = 1; i <= bookingsPerProject; i++) {
        const bookingId = `BK-2025-${String((projIndex * 10) + i).padStart(4, '0')}`;
        const status = bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)];
        const unitCost = proj.category === 'Farm Land' ? 2500000 : proj.category === 'Residential' ? 5000000 : 9000000;
        const discount = Math.floor(Math.random() * 200000);
        const netAmount = unitCost - discount;
        const bookingAmount = Math.floor(netAmount * 0.1); // 10% booking
        const amountReceived = status === 'Full Payment' || status === 'Registered' ? netAmount :
            status === 'Part Payment' ? Math.floor(netAmount * 0.5) :
                status === 'Token Paid' ? bookingAmount : 0;

        const booking = {
            id: bookingId,
            customerName: `Customer ${(projIndex * 10) + i}`,
            phone: `98765${String((projIndex * 10) + i).padStart(5, '0')}`,
            email: `customer${(projIndex * 10) + i}@example.com`,
            panNo: `ABCDE${String((projIndex * 10) + i).padStart(4, '0')}F`,
            aadharNo: `${String((projIndex * 10) + i).padStart(12, '0')}`,
            coApplicant: i % 3 === 0 ? `Co-Applicant ${i}` : '',
            address: `${i * 10} Main Street, Sector ${i}`,
            city: proj.city,
            state: proj.state,
            leadSource: leadSources[Math.floor(Math.random() * leadSources.length)],
            salesExecutive: salesExecutives[Math.floor(Math.random() * salesExecutives.length)],
            projectId: proj.id,
            projectName: proj.name,
            category: proj.category,
            inventoryId: `inv-${proj.id}-${i}`,
            plotNo: `${proj.category === 'Farm Land' ? 'P' : proj.category === 'Residential' ? 'A' : 'W'}${String(i).padStart(3, '0')}`,
            unitCost,
            discount,
            netAmount,
            bookingAmount,
            amountReceived,
            balance: netAmount - amountReceived,
            status,
            paymentPlanType: 'Milestone-based',
            agreementTemplate: 'Standard',
            agreementDate: status !== 'Token Paid' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
            registrationDate: status === 'Registered' ? new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000) : null,
            bookingDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
            createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        };

        bookings.push(booking);

        // Initialize payment schedule
        bookingPayments[bookingId] = [
            {
                id: `pay-${bookingId}-1`,
                milestone: 'Booking Amount',
                dueDate: booking.bookingDate,
                amount: bookingAmount,
                paidAmount: status !== 'Token Paid' ? bookingAmount : 0,
                status: status !== 'Token Paid' ? 'Paid' : 'Pending',
                paymentDate: status !== 'Token Paid' ? booking.bookingDate : null,
                mode: 'UPI',
                referenceNo: status !== 'Token Paid' ? `UPI${Math.random().toString(36).substr(2, 9)}` : '',
            },
            {
                id: `pay-${bookingId}-2`,
                milestone: 'Agreement Signing',
                dueDate: new Date(booking.bookingDate.getTime() + 15 * 24 * 60 * 60 * 1000),
                amount: Math.floor(netAmount * 0.2),
                paidAmount: ['Agreement Signed', 'Part Payment', 'Full Payment', 'Registered'].includes(status) ? Math.floor(netAmount * 0.2) : 0,
                status: ['Agreement Signed', 'Part Payment', 'Full Payment', 'Registered'].includes(status) ? 'Paid' : 'Pending',
                paymentDate: ['Agreement Signed', 'Part Payment', 'Full Payment', 'Registered'].includes(status) ? new Date(booking.bookingDate.getTime() + 15 * 24 * 60 * 60 * 1000) : null,
                mode: 'NEFT',
                referenceNo: ['Agreement Signed', 'Part Payment', 'Full Payment', 'Registered'].includes(status) ? `NEFT${Math.random().toString(36).substr(2, 9)}` : '',
            },
            {
                id: `pay-${bookingId}-3`,
                milestone: 'Construction Milestone',
                dueDate: new Date(booking.bookingDate.getTime() + 90 * 24 * 60 * 60 * 1000),
                amount: Math.floor(netAmount * 0.4),
                paidAmount: ['Part Payment', 'Full Payment', 'Registered'].includes(status) ? Math.floor(netAmount * 0.4) : 0,
                status: ['Part Payment', 'Full Payment', 'Registered'].includes(status) ? 'Paid' : 'Pending',
                paymentDate: ['Part Payment', 'Full Payment', 'Registered'].includes(status) ? new Date(booking.bookingDate.getTime() + 90 * 24 * 60 * 60 * 1000) : null,
                mode: 'Cheque',
                referenceNo: ['Part Payment', 'Full Payment', 'Registered'].includes(status) ? `CHQ${Math.random().toString(36).substr(2, 9)}` : '',
            },
            {
                id: `pay-${bookingId}-4`,
                milestone: 'Final Payment',
                dueDate: new Date(booking.bookingDate.getTime() + 180 * 24 * 60 * 60 * 1000),
                amount: netAmount - bookingAmount - Math.floor(netAmount * 0.2) - Math.floor(netAmount * 0.4),
                paidAmount: ['Full Payment', 'Registered'].includes(status) ? netAmount - bookingAmount - Math.floor(netAmount * 0.2) - Math.floor(netAmount * 0.4) : 0,
                status: ['Full Payment', 'Registered'].includes(status) ? 'Paid' : 'Pending',
                paymentDate: ['Full Payment', 'Registered'].includes(status) ? new Date(booking.bookingDate.getTime() + 180 * 24 * 60 * 60 * 1000) : null,
                mode: 'RTGS',
                referenceNo: ['Full Payment', 'Registered'].includes(status) ? `RTGS${Math.random().toString(36).substr(2, 9)}` : '',
            },
        ];

        // Initialize documents
        bookingDocuments[bookingId] = [
            {
                id: `doc-${bookingId}-1`,
                name: 'PAN Card.pdf',
                category: 'KYC',
                size: '1.2 MB',
                uploadedBy: booking.salesExecutive,
                uploadedAt: booking.createdAt,
            },
            {
                id: `doc-${bookingId}-2`,
                name: 'Aadhar Card.pdf',
                category: 'KYC',
                size: '0.8 MB',
                uploadedBy: booking.salesExecutive,
                uploadedAt: booking.createdAt,
            },
        ];

        if (status !== 'Token Paid') {
            bookingDocuments[bookingId].push({
                id: `doc-${bookingId}-3`,
                name: 'Agreement Draft.pdf',
                category: 'Agreement Draft',
                size: '2.5 MB',
                uploadedBy: booking.salesExecutive,
                uploadedAt: new Date(booking.createdAt.getTime() + 5 * 24 * 60 * 60 * 1000),
            });
        }

        // Initialize timeline
        bookingTimeline[bookingId] = [
            {
                id: `timeline-${bookingId}-1`,
                type: 'created',
                description: 'Booking created',
                createdBy: booking.salesExecutive,
                createdAt: booking.createdAt,
            },
            {
                id: `timeline-${bookingId}-2`,
                type: 'status_change',
                description: `Status set to ${status}`,
                createdBy: booking.salesExecutive,
                createdAt: new Date(booking.createdAt.getTime() + 1 * 24 * 60 * 60 * 1000),
            },
        ];
    }
});

// GET /bookings - List bookings with filters
app.get('/bookings', authMiddleware, (req, res) => {
    const { project, category, status, sales, fromDate, toDate, search, page = 1, limit = 10, sortBy = 'bookingDate', sortOrder = 'desc' } = req.query;

    let filtered = [...bookings];

    // Apply filters
    if (project && project !== 'All') {
        filtered = filtered.filter(b => b.projectId === project);
    }
    if (category && category !== 'All') {
        filtered = filtered.filter(b => b.category === category);
    }
    if (status && status !== 'All') {
        filtered = filtered.filter(b => b.status === status);
    }
    if (sales && sales !== 'All') {
        filtered = filtered.filter(b => b.salesExecutive === sales);
    }
    if (fromDate) {
        filtered = filtered.filter(b => new Date(b.bookingDate) >= new Date(fromDate));
    }
    if (toDate) {
        filtered = filtered.filter(b => new Date(b.bookingDate) <= new Date(toDate));
    }
    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(b =>
            b.id.toLowerCase().includes(searchLower) ||
            b.customerName.toLowerCase().includes(searchLower) ||
            b.phone.includes(searchLower) ||
            b.projectName.toLowerCase().includes(searchLower)
        );
    }

    // Sort
    filtered.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        if (sortBy === 'bookingDate' || sortBy === 'createdAt') {
            aVal = new Date(aVal).getTime();
            bVal = new Date(bVal).getTime();
        }

        if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedBookings = filtered.slice(startIndex, endIndex);

    res.json({
        data: paginatedBookings,
        total: filtered.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(filtered.length / limit),
    });
});

// GET /bookings/summary - Summary stats
app.get('/bookings/summary', authMiddleware, (req, res) => {
    const summary = {
        total: bookings.length,
        confirmed: bookings.filter(b => ['Agreement Signed', 'Part Payment', 'Full Payment', 'Registered'].includes(b.status)).length,
        pendingPayments: bookings.filter(b => b.balance > 0 && b.status !== 'Cancelled').length,
        registered: bookings.filter(b => b.status === 'Registered').length,
        cancelled: bookings.filter(b => b.status === 'Cancelled').length,
    };
    res.json(summary);
});

// GET /bookings/:id - Get single booking
app.get('/bookings/:id', authMiddleware, (req, res) => {
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
});

// POST /bookings - Create booking
app.post('/bookings', authMiddleware, (req, res) => {
    const newBooking = {
        id: `BK-2025-${String(bookings.length + 1).padStart(4, '0')}`,
        ...req.body,
        amountReceived: 0,
        balance: req.body.netAmount,
        status: 'Token Paid',
        bookingDate: new Date(),
        createdAt: new Date(),
    };

    bookings.unshift(newBooking);

    // Initialize payment schedule
    bookingPayments[newBooking.id] = req.body.paymentSchedule || [];

    // Initialize documents and timeline
    bookingDocuments[newBooking.id] = [];
    bookingTimeline[newBooking.id] = [{
        id: `timeline-${newBooking.id}-1`,
        type: 'created',
        description: 'Booking created',
        createdBy: newBooking.salesExecutive,
        createdAt: new Date(),
    }];

    // Update inventory status to Reserved
    const inventoryIndex = inventoryItems.findIndex(i => i.id === newBooking.inventoryId);
    if (inventoryIndex !== -1) {
        inventoryItems[inventoryIndex].status = 'Reserved';
    }

    res.status(201).json(newBooking);
});

// PATCH /bookings/:id/status - Update status
app.patch('/bookings/:id/status', authMiddleware, (req, res) => {
    const index = bookings.findIndex(b => b.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Booking not found' });
    }

    const oldStatus = bookings[index].status;
    bookings[index].status = req.body.status;

    // Update inventory status based on booking status
    if (req.body.status === 'Registered') {
        const inventoryIndex = inventoryItems.findIndex(i => i.id === bookings[index].inventoryId);
        if (inventoryIndex !== -1) {
            inventoryItems[inventoryIndex].status = 'Sold';
        }
    }

    // Add timeline entry
    bookingTimeline[req.params.id].unshift({
        id: `timeline-${req.params.id}-${Date.now()}`,
        type: 'status_change',
        description: `Status changed from "${oldStatus}" to "${req.body.status}"`,
        createdBy: 'Admin',
        createdAt: new Date(),
    });

    res.json(bookings[index]);
});

// PATCH /bookings/:id/cancel - Cancel booking
app.patch('/bookings/:id/cancel', authMiddleware, (req, res) => {
    const index = bookings.findIndex(b => b.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Booking not found' });
    }

    bookings[index].status = 'Cancelled';
    bookings[index].cancellationReason = req.body.reason;
    bookings[index].refundAmount = req.body.refundAmount || 0;

    // Release inventory
    const inventoryIndex = inventoryItems.findIndex(i => i.id === bookings[index].inventoryId);
    if (inventoryIndex !== -1) {
        inventoryItems[inventoryIndex].status = 'Available';
    }

    // Add timeline entry
    bookingTimeline[req.params.id].unshift({
        id: `timeline-${req.params.id}-${Date.now()}`,
        type: 'cancelled',
        description: `Booking cancelled. Reason: ${req.body.reason}`,
        createdBy: 'Admin',
        createdAt: new Date(),
    });

    res.json(bookings[index]);
});

// GET /bookings/:id/payments - Get payment schedule
app.get('/bookings/:id/payments', authMiddleware, (req, res) => {
    res.json(bookingPayments[req.params.id] || []);
});

// POST /bookings/:id/payments - Add payment
app.post('/bookings/:id/payments', authMiddleware, (req, res) => {
    const newPayment = {
        id: `pay-${req.params.id}-${Date.now()}`,
        ...req.body,
        paymentDate: new Date(),
    };

    if (!bookingPayments[req.params.id]) {
        bookingPayments[req.params.id] = [];
    }
    bookingPayments[req.params.id].unshift(newPayment);

    // Update booking amounts
    const bookingIndex = bookings.findIndex(b => b.id === req.params.id);
    if (bookingIndex !== -1) {
        bookings[bookingIndex].amountReceived += newPayment.amount;
        bookings[bookingIndex].balance = bookings[bookingIndex].netAmount - bookings[bookingIndex].amountReceived;
    }

    // Add timeline entry
    bookingTimeline[req.params.id].unshift({
        id: `timeline-${req.params.id}-${Date.now()}`,
        type: 'payment',
        description: `Payment of ₹${newPayment.amount.toLocaleString('en-IN')} received (${newPayment.mode})`,
        createdBy: 'Admin',
        createdAt: new Date(),
    });

    res.status(201).json(newPayment);
});

// GET /bookings/:id/files - Get documents
app.get('/bookings/:id/files', authMiddleware, (req, res) => {
    res.json(bookingDocuments[req.params.id] || []);
});

// POST /bookings/:id/files - Upload document
app.post('/bookings/:id/files', authMiddleware, (req, res) => {
    const newDoc = {
        id: `doc-${req.params.id}-${Date.now()}`,
        ...req.body,
        uploadedAt: new Date(),
    };

    if (!bookingDocuments[req.params.id]) {
        bookingDocuments[req.params.id] = [];
    }
    bookingDocuments[req.params.id].unshift(newDoc);

    // Add timeline entry
    bookingTimeline[req.params.id].unshift({
        id: `timeline-${req.params.id}-${Date.now()}`,
        type: 'document',
        description: `Document uploaded: ${newDoc.name} (${newDoc.category})`,
        createdBy: newDoc.uploadedBy,
        createdAt: new Date(),
    });

    res.status(201).json(newDoc);
});

// DELETE /bookings/:id/files/:fileId - Delete document
app.delete('/bookings/:id/files/:fileId', authMiddleware, (req, res) => {
    if (!bookingDocuments[req.params.id]) {
        return res.status(404).json({ error: 'Booking not found' });
    }

    const index = bookingDocuments[req.params.id].findIndex(f => f.id === req.params.fileId);
    if (index === -1) {
        return res.status(404).json({ error: 'File not found' });
    }

    bookingDocuments[req.params.id].splice(index, 1);
    res.json({ message: 'File deleted successfully' });
});

// GET /bookings/:id/timeline - Get timeline
app.get('/bookings/:id/timeline', authMiddleware, (req, res) => {
    res.json(bookingTimeline[req.params.id] || []);
});

// POST /bookings/:id/timeline - Add timeline entry
app.post('/bookings/:id/timeline', authMiddleware, (req, res) => {
    const newEntry = {
        id: `timeline-${req.params.id}-${Date.now()}`,
        ...req.body,
        createdAt: new Date(),
    };

    if (!bookingTimeline[req.params.id]) {
        bookingTimeline[req.params.id] = [];
    }
    bookingTimeline[req.params.id].unshift(newEntry);

    res.status(201).json(newEntry);
});

// ==========================================
// SETTINGS ENDPOINTS
// ==========================================

// Sample users data
let users = [
    {
        id: 'user-1',
        name: 'Admin User',
        email: 'admin@gajrajah.com',
        phone: '9876543210',
        designation: 'Administrator',
        department: 'Management',
        whatsapp: '9876543210',
        role: 'Admin',
        status: 'Active',
        avatar: null,
        signature: null,
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'user-2',
        name: 'Rajesh Kumar',
        email: 'rajesh@gajrajah.com',
        phone: '9876543211',
        designation: 'Sales Manager',
        department: 'Sales',
        whatsapp: '9876543211',
        role: 'Sales Manager',
        status: 'Active',
        avatar: null,
        signature: null,
        lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'user-3',
        name: 'Priya Sharma',
        email: 'priya@gajrajah.com',
        phone: '9876543212',
        designation: 'Sales Executive',
        department: 'Sales',
        whatsapp: '9876543212',
        role: 'Sales Executive',
        status: 'Active',
        avatar: null,
        signature: null,
        lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'user-4',
        name: 'Amit Patel',
        email: 'amit@gajrajah.com',
        phone: '9876543213',
        designation: 'Pre-Sales Executive',
        department: 'Pre-Sales',
        whatsapp: '9876543213',
        role: 'Pre-Sales',
        status: 'Active',
        avatar: null,
        signature: null,
        lastLogin: new Date(Date.now() - 3 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'user-5',
        name: 'Sneha Reddy',
        email: 'sneha@gajrajah.com',
        phone: '9876543214',
        designation: 'Sales Executive',
        department: 'Sales',
        whatsapp: '9876543214',
        role: 'Sales Executive',
        status: 'Disabled',
        avatar: null,
        signature: null,
        lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
];

// Sample roles with permissions
let roles = [
    {
        id: 'role-1',
        name: 'Admin',
        description: 'Full system access',
        permissions: {
            dashboard: { view: true, create: true, edit: true, delete: true, assign: true, export: true },
            leads: { view: true, create: true, edit: true, delete: true, assign: true, export: true },
            projects: { view: true, create: true, edit: true, delete: true, assign: true, export: true },
            inventory: { view: true, create: true, edit: true, delete: true, assign: true, export: true },
            bookings: { view: true, create: true, edit: true, delete: true, assign: true, export: true },
            siteVisits: { view: true, create: true, edit: true, delete: true, assign: true, export: true },
            payments: { view: true, create: true, edit: true, delete: true, assign: true, export: true },
            documents: { view: true, create: true, edit: true, delete: true, assign: true, export: true },
            settings: { view: true, create: true, edit: true, delete: true, assign: true, export: true },
        },
    },
    {
        id: 'role-2',
        name: 'Sales Manager',
        description: 'Manage sales team and view reports',
        permissions: {
            dashboard: { view: true, create: false, edit: false, delete: false, assign: false, export: true },
            leads: { view: true, create: true, edit: true, delete: false, assign: true, export: true },
            projects: { view: true, create: false, edit: false, delete: false, assign: false, export: true },
            inventory: { view: true, create: false, edit: false, delete: false, assign: false, export: true },
            bookings: { view: true, create: true, edit: true, delete: false, assign: true, export: true },
            siteVisits: { view: true, create: true, edit: true, delete: false, assign: true, export: true },
            payments: { view: true, create: false, edit: false, delete: false, assign: false, export: true },
            documents: { view: true, create: true, edit: true, delete: false, assign: false, export: true },
            settings: { view: true, create: false, edit: false, delete: false, assign: false, export: false },
        },
    },
    {
        id: 'role-3',
        name: 'Sales Executive',
        description: 'Handle leads and bookings',
        permissions: {
            dashboard: { view: true, create: false, edit: false, delete: false, assign: false, export: false },
            leads: { view: true, create: true, edit: true, delete: false, assign: false, export: false },
            projects: { view: true, create: false, edit: false, delete: false, assign: false, export: false },
            inventory: { view: true, create: false, edit: false, delete: false, assign: false, export: false },
            bookings: { view: true, create: true, edit: true, delete: false, assign: false, export: false },
            siteVisits: { view: true, create: true, edit: true, delete: false, assign: false, export: false },
            payments: { view: true, create: false, edit: false, delete: false, assign: false, export: false },
            documents: { view: true, create: true, edit: false, delete: false, assign: false, export: false },
            settings: { view: true, create: false, edit: false, delete: false, assign: false, export: false },
        },
    },
    {
        id: 'role-4',
        name: 'Pre-Sales',
        description: 'Lead generation and qualification',
        permissions: {
            dashboard: { view: true, create: false, edit: false, delete: false, assign: false, export: false },
            leads: { view: true, create: true, edit: true, delete: false, assign: false, export: false },
            projects: { view: true, create: false, edit: false, delete: false, assign: false, export: false },
            inventory: { view: true, create: false, edit: false, delete: false, assign: false, export: false },
            bookings: { view: false, create: false, edit: false, delete: false, assign: false, export: false },
            siteVisits: { view: true, create: true, edit: true, delete: false, assign: false, export: false },
            payments: { view: false, create: false, edit: false, delete: false, assign: false, export: false },
            documents: { view: true, create: true, edit: false, delete: false, assign: false, export: false },
            settings: { view: true, create: false, edit: false, delete: false, assign: false, export: false },
        },
    },
];

// Automation rules
let automationRules = [
    {
        id: 'rule-1',
        name: 'Auto-assign hot leads',
        trigger: 'New Lead Created',
        conditions: { field: 'status', operator: '=', value: 'Hot' },
        actions: [{ type: 'assign', value: 'user-2' }],
        enabled: true,
        createdAt: new Date(),
    },
    {
        id: 'rule-2',
        name: 'Send booking confirmation',
        trigger: 'Booking Created',
        conditions: {},
        actions: [{ type: 'send_whatsapp', template: 'booking_confirmation' }],
        enabled: true,
        createdAt: new Date(),
    },
    {
        id: 'rule-3',
        name: 'Payment reminder',
        trigger: 'Payment Received',
        conditions: { field: 'balance', operator: '>', value: 0 },
        actions: [{ type: 'create_task', value: 'Follow up for pending payment' }],
        enabled: false,
        createdAt: new Date(),
    },
];

// Integrations
let integrations = {
    whatsapp: {
        enabled: false,
        apiKey: '',
        phoneNumber: '',
    },
    metaLeads: {
        enabled: false,
        accessToken: '',
        pageId: '',
    },
    sms: {
        enabled: false,
        apiKey: '',
        senderId: '',
    },
    webhooks: {
        enabled: false,
        url: '',
        events: [],
    },
};

// Notification settings
let notificationSettings = {
    email: true,
    whatsapp: true,
    push: true,
    dailySummary: true,
    templates: {
        leadFollowUp: 'Hi {name}, this is a reminder to follow up on your inquiry.',
        paymentAck: 'Dear {name}, we have received your payment of ₹{amount}. Thank you!',
        bookingConfirmation: 'Dear {name}, your booking for {project} - {plot} is confirmed!',
    },
};

// Branding settings
let brandingSettings = {
    companyName: 'Gajrajah Buildcon',
    logo: null,
    favicon: null,
    themeMode: 'light',
    primaryColor: '#1e40af',
};

// Audit logs
let auditLogs = [];
for (let i = 1; i <= 30; i++) {
    auditLogs.push({
        id: `audit-${i}`,
        timestamp: new Date(Date.now() - i * 2 * 60 * 60 * 1000),
        user: users[Math.floor(Math.random() * users.length)].name,
        action: ['Created', 'Updated', 'Deleted', 'Viewed'][Math.floor(Math.random() * 4)],
        module: ['Leads', 'Projects', 'Bookings', 'Inventory', 'Users'][Math.floor(Math.random() * 5)],
        oldValue: i % 3 === 0 ? 'Follow-Up' : null,
        newValue: i % 3 === 0 ? 'Hot' : null,
    });
}

// Billing info
const billingInfo = {
    plan: 'Professional',
    storage: { used: 2.5, total: 10, unit: 'GB' },
    users: { current: 5, limit: 10 },
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
};

// System defaults
let systemDefaults = {
    defaultLeadStatus: 'New',
    defaultPaymentTerms: '30 days',
    defaultCurrency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Asia/Kolkata',
};

// GET /me - Get current user profile
app.get('/me', authMiddleware, (req, res) => {
    const user = users.find(u => u.email === 'admin@gajrajah.com'); // Mock current user
    res.json(user);
});

// PUT /me - Update profile
app.put('/me', authMiddleware, (req, res) => {
    const userIndex = users.findIndex(u => u.email === 'admin@gajrajah.com');
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...req.body };
        res.json(users[userIndex]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// PUT /me/password - Change password
app.put('/me/password', authMiddleware, (req, res) => {
    // In real app, verify current password and hash new password
    res.json({ message: 'Password updated successfully' });
});

// PUT /me/avatar - Upload avatar
app.put('/me/avatar', authMiddleware, (req, res) => {
    const userIndex = users.findIndex(u => u.email === 'admin@gajrajah.com');
    if (userIndex !== -1) {
        users[userIndex].avatar = req.body.avatar;
        res.json(users[userIndex]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// PUT /me/signature - Upload signature
app.put('/me/signature', authMiddleware, (req, res) => {
    const userIndex = users.findIndex(u => u.email === 'admin@gajrajah.com');
    if (userIndex !== -1) {
        users[userIndex].signature = req.body.signature;
        res.json(users[userIndex]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Duplicate User endpoints removed to favor bottom implementation

// GET /roles - List all roles
app.get('/roles', authMiddleware, (req, res) => {
    res.json(roles);
});

// POST /roles - Create role
app.post('/roles', authMiddleware, (req, res) => {
    const newRole = {
        id: `role-${Date.now()}`,
        ...req.body,
    };
    roles.push(newRole);
    res.status(201).json(newRole);
});

// PUT /roles/:id - Update role
app.put('/roles/:id', authMiddleware, (req, res) => {
    const index = roles.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
        roles[index] = { ...roles[index], ...req.body };
        res.json(roles[index]);
    } else {
        res.status(404).json({ error: 'Role not found' });
    }
});

// DELETE /roles/:id - Delete role
app.delete('/roles/:id', authMiddleware, (req, res) => {
    const index = roles.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
        roles.splice(index, 1);
        res.json({ message: 'Role deleted successfully' });
    } else {
        res.status(404).json({ error: 'Role not found' });
    }
});

// PUT /roles/:id/permissions - Update permissions
app.put('/roles/:id/permissions', authMiddleware, (req, res) => {
    const index = roles.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
        roles[index].permissions = req.body.permissions;
        res.json(roles[index]);
    } else {
        res.status(404).json({ error: 'Role not found' });
    }
});

// GET /automation/rules - List automation rules
app.get('/automation/rules', authMiddleware, (req, res) => {
    res.json(automationRules);
});

// POST /automation/rules - Create rule
app.post('/automation/rules', authMiddleware, (req, res) => {
    const newRule = {
        id: `rule-${Date.now()}`,
        ...req.body,
        createdAt: new Date(),
    };
    automationRules.push(newRule);
    res.status(201).json(newRule);
});

// PUT /automation/rules/:id - Update rule
app.put('/automation/rules/:id', authMiddleware, (req, res) => {
    const index = automationRules.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
        automationRules[index] = { ...automationRules[index], ...req.body };
        res.json(automationRules[index]);
    } else {
        res.status(404).json({ error: 'Rule not found' });
    }
});

// DELETE /automation/rules/:id - Delete rule
app.delete('/automation/rules/:id', authMiddleware, (req, res) => {
    const index = automationRules.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
        automationRules.splice(index, 1);
        res.json({ message: 'Rule deleted successfully' });
    } else {
        res.status(404).json({ error: 'Rule not found' });
    }
});

// GET /settings/integrations - Get integrations
app.get('/settings/integrations', authMiddleware, (req, res) => {
    res.json(integrations);
});

// PUT /settings/integrations - Update integrations
app.put('/settings/integrations', authMiddleware, (req, res) => {
    integrations = { ...integrations, ...req.body };
    res.json(integrations);
});

// POST /settings/integrations/test - Test connection
app.post('/settings/integrations/test', authMiddleware, (req, res) => {
    res.json({ success: true, message: 'Connection successful' });
});

// GET /settings/notifications - Get notification settings
app.get('/settings/notifications', authMiddleware, (req, res) => {
    res.json(notificationSettings);
});

// PUT /settings/notifications - Update notification settings
app.put('/settings/notifications', authMiddleware, (req, res) => {
    notificationSettings = { ...notificationSettings, ...req.body };
    res.json(notificationSettings);
});

// GET /settings/branding - Get branding settings
app.get('/settings/branding', authMiddleware, (req, res) => {
    res.json(brandingSettings);
});

// PUT /settings/branding - Update branding settings
app.put('/settings/branding', authMiddleware, (req, res) => {
    brandingSettings = { ...brandingSettings, ...req.body };
    res.json(brandingSettings);
});

// GET /audit-logs - Get audit logs
app.get('/audit-logs', authMiddleware, (req, res) => {
    const { user, module, fromDate, toDate, page = 1, limit = 20 } = req.query;
    let filtered = [...auditLogs];

    if (user && user !== 'All') {
        filtered = filtered.filter(log => log.user === user);
    }
    if (module && module !== 'All') {
        filtered = filtered.filter(log => log.module === module);
    }
    if (fromDate) {
        filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(fromDate));
    }
    if (toDate) {
        filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(toDate));
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedLogs = filtered.slice(startIndex, endIndex);

    res.json({
        data: paginatedLogs,
        total: filtered.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(filtered.length / limit),
    });
});

// GET /settings/billing - Get billing info
app.get('/settings/billing', authMiddleware, (req, res) => {
    res.json(billingInfo);
});

// GET /settings/defaults - Get system defaults
app.get('/settings/defaults', authMiddleware, (req, res) => {
    res.json(systemDefaults);
});

// PUT /settings/defaults - Update system defaults
app.put('/settings/defaults', authMiddleware, (req, res) => {
    systemDefaults = { ...systemDefaults, ...req.body };
    res.json(systemDefaults);
});

// ==========================================
// REPORTS & ANALYTICS ENDPOINTS
// ==========================================

// Scheduled reports
let scheduledReports = [
    {
        id: 'sched-1',
        name: 'Weekly Sales Report',
        reportType: 'bookings',
        frequency: 'Weekly',
        deliveryFormat: 'PDF',
        deliveryTime: '09:00',
        recipients: ['admin@gajrajah.com', 'manager@gajrajah.com'],
        enabled: true,
        filters: {},
        createdAt: new Date(),
    },
    {
        id: 'sched-2',
        name: 'Monthly Revenue Report',
        reportType: 'payments',
        frequency: 'Monthly',
        deliveryFormat: 'Excel',
        deliveryTime: '10:00',
        recipients: ['admin@gajrajah.com'],
        enabled: true,
        filters: {},
        createdAt: new Date(),
    },
];

// GET /reports/overview - Overview KPIs
app.get('/reports/overview', authMiddleware, (req, res) => {
    const totalLeads = leads.length;
    const totalProjects = projects.length;
    const totalUnits = inventoryItems.length;
    const availableUnits = inventoryItems.filter(i => i.status === 'Available').length;
    const totalBookings = bookings.length;
    const revenueCollected = bookings.reduce((sum, b) => sum + b.amountReceived, 0);
    const revenuePending = bookings.reduce((sum, b) => sum + b.balance, 0);

    res.json({
        totalLeads,
        totalProjects,
        totalUnits,
        availableUnits,
        totalBookings,
        revenueCollected,
        revenuePending,
    });
});

// GET /reports/sales-funnel - Sales funnel data
app.get('/reports/sales-funnel', authMiddleware, (req, res) => {
    const totalLeads = leads.length;
    const siteVisits = Math.floor(totalLeads * 0.6); // 60% visit
    const bookingsCount = bookings.length;
    const agreements = bookings.filter(b => ['Agreement Signed', 'Part Payment', 'Full Payment', 'Registered'].includes(b.status)).length;
    const registered = bookings.filter(b => b.status === 'Registered').length;

    res.json({
        stages: [
            { name: 'Leads', value: totalLeads },
            { name: 'Site Visits', value: siteVisits },
            { name: 'Bookings', value: bookingsCount },
            { name: 'Agreements', value: agreements },
            { name: 'Registered', value: registered },
        ],
    });
});

// GET /reports/leads-by-source - Lead source breakdown
app.get('/reports/leads-by-source', authMiddleware, (req, res) => {
    const sources = {};
    leads.forEach(lead => {
        sources[lead.source] = (sources[lead.source] || 0) + 1;
    });

    const data = Object.entries(sources).map(([name, value]) => ({ name, value }));
    res.json(data);
});

// GET /reports/monthly-sales - Monthly sales trend
app.get('/reports/monthly-sales', authMiddleware, (req, res) => {
    const monthlySales = {};
    bookings.forEach(booking => {
        const month = new Date(booking.bookingDate).toLocaleString('en-US', { month: 'short', year: 'numeric' });
        monthlySales[month] = (monthlySales[month] || 0) + booking.netAmount;
    });

    const data = Object.entries(monthlySales).map(([month, revenue]) => ({ month, revenue }));
    res.json(data);
});

// GET /reports/leads - Detailed leads report
app.get('/reports/leads', authMiddleware, (req, res) => {
    const { source, status, assignedTo, fromDate, toDate } = req.query;
    let filtered = [...leads];

    if (source && source !== 'All') {
        filtered = filtered.filter(l => l.source === source);
    }
    if (status && status !== 'All') {
        filtered = filtered.filter(l => l.status === status);
    }
    if (assignedTo && assignedTo !== 'All') {
        filtered = filtered.filter(l => l.assignedTo === assignedTo);
    }
    if (fromDate) {
        filtered = filtered.filter(l => new Date(l.createdAt) >= new Date(fromDate));
    }
    if (toDate) {
        filtered = filtered.filter(l => new Date(l.createdAt) <= new Date(toDate));
    }

    // Calculate metrics
    const totalLeads = filtered.length;
    const converted = filtered.filter(l => l.status === 'Converted').length;
    const conversionRate = totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(2) : 0;

    res.json({
        data: filtered,
        metrics: {
            totalLeads,
            converted,
            conversionRate: parseFloat(conversionRate),
        },
    });
});

// GET /reports/inventory - Inventory report
app.get('/reports/inventory', authMiddleware, (req, res) => {
    const { project, category, facing } = req.query;
    let filtered = [...inventoryItems];

    if (project && project !== 'All') {
        filtered = filtered.filter(i => i.projectId === project);
    }
    if (category && category !== 'All') {
        filtered = filtered.filter(i => i.category === category);
    }
    if (facing && facing !== 'All') {
        filtered = filtered.filter(i => i.facing === facing);
    }

    // Calculate metrics
    const total = filtered.length;
    const available = filtered.filter(i => i.status === 'Available').length;
    const sold = filtered.filter(i => i.status === 'Sold').length;
    const reserved = filtered.filter(i => i.status === 'Reserved').length;
    const blocked = filtered.filter(i => i.status === 'Blocked').length;

    // Facing breakdown
    const facingBreakdown = {};
    filtered.forEach(item => {
        facingBreakdown[item.facing] = (facingBreakdown[item.facing] || 0) + 1;
    });

    // Category breakdown
    const categoryBreakdown = {};
    filtered.forEach(item => {
        const cat = projects.find(p => p.id === item.projectId)?.category || 'Unknown';
        categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
    });

    res.json({
        data: filtered,
        metrics: {
            total,
            available,
            sold,
            reserved,
            blocked,
            soldPercentage: total > 0 ? ((sold / total) * 100).toFixed(2) : 0,
        },
        facingBreakdown,
        categoryBreakdown,
    });
});

// GET /reports/bookings - Bookings report
app.get('/reports/bookings', authMiddleware, (req, res) => {
    const { project, status, fromDate, toDate } = req.query;
    let filtered = [...bookings];

    if (project && project !== 'All') {
        filtered = filtered.filter(b => b.projectId === project);
    }
    if (status && status !== 'All') {
        filtered = filtered.filter(b => b.status === status);
    }
    if (fromDate) {
        filtered = filtered.filter(b => new Date(b.bookingDate) >= new Date(fromDate));
    }
    if (toDate) {
        filtered = filtered.filter(b => new Date(b.bookingDate) <= new Date(toDate));
    }

    // Calculate metrics
    const totalBookings = filtered.length;
    const registered = filtered.filter(b => b.status === 'Registered').length;
    const cancelled = filtered.filter(b => b.status === 'Cancelled').length;
    const avgBookingValue = totalBookings > 0 ? filtered.reduce((sum, b) => sum + b.netAmount, 0) / totalBookings : 0;

    // Status breakdown
    const statusBreakdown = {};
    filtered.forEach(booking => {
        statusBreakdown[booking.status] = (statusBreakdown[booking.status] || 0) + 1;
    });

    res.json({
        data: filtered,
        metrics: {
            totalBookings,
            registered,
            cancelled,
            avgBookingValue: Math.round(avgBookingValue),
            conversionRate: totalBookings > 0 ? ((registered / totalBookings) * 100).toFixed(2) : 0,
        },
        statusBreakdown,
    });
});

// GET /reports/payments - Payments report
app.get('/reports/payments', authMiddleware, (req, res) => {
    const { project, status, fromDate, toDate } = req.query;
    let filtered = [...bookings];

    if (project && project !== 'All') {
        filtered = filtered.filter(b => b.projectId === project);
    }
    if (fromDate) {
        filtered = filtered.filter(b => new Date(b.bookingDate) >= new Date(fromDate));
    }
    if (toDate) {
        filtered = filtered.filter(b => new Date(b.bookingDate) <= new Date(toDate));
    }

    // Calculate metrics
    const totalRevenue = filtered.reduce((sum, b) => sum + b.netAmount, 0);
    const collected = filtered.reduce((sum, b) => sum + b.amountReceived, 0);
    const pending = filtered.reduce((sum, b) => sum + b.balance, 0);
    const overdue = Math.floor(pending * 0.3); // Simulate 30% overdue

    // Collection by sales executive
    const bySalesExec = {};
    filtered.forEach(booking => {
        bySalesExec[booking.salesExecutive] = (bySalesExec[booking.salesExecutive] || 0) + booking.amountReceived;
    });

    res.json({
        data: filtered,
        metrics: {
            totalRevenue,
            collected,
            pending,
            overdue,
            collectionRate: totalRevenue > 0 ? ((collected / totalRevenue) * 100).toFixed(2) : 0,
        },
        bySalesExec,
    });
});

// GET /reports/users - User performance report
app.get('/reports/users', authMiddleware, (req, res) => {
    const performance = mockUsers.map(user => {
        const userLeads = leads.filter(l => l.assignedTo === user.name);
        const userBookings = bookings.filter(b => b.salesExecutive === user.name);
        const revenue = userBookings.reduce((sum, b) => sum + b.amountReceived, 0);

        return {
            id: user.id,
            name: user.name,
            role: user.role,
            leadsAssigned: userLeads.length,
            leadsConverted: userLeads.filter(l => l.status === 'Converted').length,
            bookings: userBookings.length,
            revenue,
            conversionRate: userLeads.length > 0 ? ((userLeads.filter(l => l.status === 'Converted').length / userLeads.length) * 100).toFixed(2) : 0,
        };
    });

    res.json(performance);
});

// GET /reports/scheduled - List scheduled reports
app.get('/reports/scheduled', authMiddleware, (req, res) => {
    res.json(scheduledReports);
});

// POST /reports/scheduled - Create scheduled report
app.post('/reports/scheduled', authMiddleware, (req, res) => {
    const newReport = {
        id: `sched-${Date.now()}`,
        ...req.body,
        createdAt: new Date(),
    };
    scheduledReports.push(newReport);
    res.status(201).json(newReport);
});

// PUT /reports/scheduled/:id - Update scheduled report
app.put('/reports/scheduled/:id', authMiddleware, (req, res) => {
    const index = scheduledReports.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
        scheduledReports[index] = { ...scheduledReports[index], ...req.body };
        res.json(scheduledReports[index]);
    } else {
        res.status(404).json({ error: 'Scheduled report not found' });
    }
});

// DELETE /reports/scheduled/:id - Delete scheduled report
app.delete('/reports/scheduled/:id', authMiddleware, (req, res) => {
    const index = scheduledReports.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
        scheduledReports.splice(index, 1);
        res.json({ message: 'Scheduled report deleted successfully' });
    } else {
        res.status(404).json({ error: 'Scheduled report not found' });
    }
});

// POST /reports/export - Export report
app.post('/reports/export', authMiddleware, (req, res) => {
    const { reportType, format, filters } = req.body;
    // Simulate export
    res.json({
        success: true,
        message: `Report exported as ${format}`,
        downloadUrl: `/downloads/report-${Date.now()}.${format.toLowerCase()}`,
    });
});

// POST /reports/email - Email report
app.post('/reports/email', authMiddleware, (req, res) => {
    const { reportType, recipients, format } = req.body;
    // Simulate email
    res.json({
        success: true,
        message: `Report emailed to ${recipients.length} recipient(s)`,
    });
});

// ==========================================
// SITE VISITS ENDPOINTS
// ==========================================

// Sample site visits
let siteVisits = [];
for (let i = 1; i <= 25; i++) {
    const statuses = ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'No Show', 'Rescheduled', 'Converted to Booking'];
    const visitModes = ['Onsite', 'Google Meet', 'Office Visit'];
    const outcomes = ['Positive Response', 'Interested', 'Negotiation Required', 'Follow-up Visit Needed', 'Drop / Not Interested'];

    const visitDate = new Date(Date.now() + (i - 12) * 24 * 60 * 60 * 1000); // Spread across past and future
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const lead = leads[Math.floor(Math.random() * leads.length)];
    const project = projects[Math.floor(Math.random() * projects.length)];
    const executive = mockUsers.filter(u => u.role.includes('Sales'))[Math.floor(Math.random() * 3)];

    siteVisits.push({
        id: `VIS-${String(i).padStart(4, '0')}`,
        leadId: lead.id,
        leadName: lead.name,
        leadPhone: lead.phone,
        leadEmail: lead.email,
        projectId: project.id,
        projectName: project.name,
        preferredPlot: i % 3 === 0 ? `Plot ${Math.floor(Math.random() * 50) + 1}` : null,
        visitDate: visitDate,
        visitTime: `${9 + Math.floor(Math.random() * 8)}:${['00', '30'][Math.floor(Math.random() * 2)]}`,
        visitMode: visitModes[Math.floor(Math.random() * visitModes.length)],
        assignedExecutive: executive.name,
        assignedExecutiveId: executive.id,
        status: status,
        expectedOutcome: 'Booking Decision',
        actualOutcome: status === 'Completed' ? outcomes[Math.floor(Math.random() * outcomes.length)] : null,
        followUpRequired: status === 'Completed' ? Math.random() > 0.5 : true,
        followUpDate: status === 'Completed' && Math.random() > 0.5 ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
        notes: status === 'Completed' ? 'Customer showed interest in the project. Discussed payment plans.' : '',
        sendReminders: true,
        createdAt: new Date(Date.now() - (25 - i) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        timeline: [
            {
                id: `timeline-${i}-1`,
                action: 'Visit Scheduled',
                user: executive.name,
                timestamp: new Date(Date.now() - (25 - i) * 24 * 60 * 60 * 1000),
            },
        ],
        attachments: [],
    });
}

// GET /site-visits - List site visits with filters
app.get('/site-visits', authMiddleware, (req, res) => {
    const { project, status, user, fromDate, toDate, search, page = 1, limit = 10 } = req.query;
    let filtered = [...siteVisits];

    if (project && project !== 'All') {
        filtered = filtered.filter(v => v.projectId === project);
    }
    if (status && status !== 'All') {
        filtered = filtered.filter(v => v.status === status);
    }
    if (user && user !== 'All') {
        filtered = filtered.filter(v => v.assignedExecutiveId === user);
    }
    if (fromDate) {
        filtered = filtered.filter(v => new Date(v.visitDate) >= new Date(fromDate));
    }
    if (toDate) {
        filtered = filtered.filter(v => new Date(v.visitDate) <= new Date(toDate));
    }
    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(v =>
            v.leadName.toLowerCase().includes(searchLower) ||
            v.leadPhone.includes(searchLower) ||
            v.id.toLowerCase().includes(searchLower)
        );
    }

    // Sort by visit date (newest first)
    filtered.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedVisits = filtered.slice(startIndex, endIndex);

    res.json({
        data: paginatedVisits,
        total: filtered.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(filtered.length / limit),
    });
});

// POST /site-visits - Create new site visit
app.post('/site-visits', authMiddleware, (req, res) => {
    const newVisit = {
        id: `VIS-${String(siteVisits.length + 1).padStart(4, '0')}`,
        ...req.body,
        status: 'Scheduled',
        actualOutcome: null,
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        timeline: [
            {
                id: `timeline-${Date.now()}-1`,
                action: 'Visit Scheduled',
                user: req.body.assignedExecutive || 'System',
                timestamp: new Date(),
            },
        ],
        attachments: [],
    };
    siteVisits.push(newVisit);
    res.status(201).json(newVisit);
});

// GET /site-visits/:id - Get visit details
app.get('/site-visits/:id', authMiddleware, (req, res) => {
    const visit = siteVisits.find(v => v.id === req.params.id);
    if (visit) {
        res.json(visit);
    } else {
        res.status(404).json({ error: 'Visit not found' });
    }
});

// PUT /site-visits/:id - Update visit
app.put('/site-visits/:id', authMiddleware, (req, res) => {
    const index = siteVisits.findIndex(v => v.id === req.params.id);
    if (index !== -1) {
        siteVisits[index] = { ...siteVisits[index], ...req.body, updatedAt: new Date() };
        res.json(siteVisits[index]);
    } else {
        res.status(404).json({ error: 'Visit not found' });
    }
});

// PATCH /site-visits/:id/status - Update status
app.patch('/site-visits/:id/status', authMiddleware, (req, res) => {
    const index = siteVisits.findIndex(v => v.id === req.params.id);
    if (index !== -1) {
        const oldStatus = siteVisits[index].status;
        siteVisits[index].status = req.body.status;
        siteVisits[index].updatedAt = new Date();

        // Add timeline entry
        siteVisits[index].timeline.push({
            id: `timeline-${Date.now()}`,
            action: `Status changed from ${oldStatus} to ${req.body.status}`,
            user: req.body.user || 'System',
            timestamp: new Date(),
        });

        res.json(siteVisits[index]);
    } else {
        res.status(404).json({ error: 'Visit not found' });
    }
});

// PATCH /site-visits/:id/reschedule - Reschedule visit
app.patch('/site-visits/:id/reschedule', authMiddleware, (req, res) => {
    const index = siteVisits.findIndex(v => v.id === req.params.id);
    if (index !== -1) {
        const oldDate = siteVisits[index].visitDate;
        siteVisits[index].visitDate = req.body.visitDate;
        siteVisits[index].visitTime = req.body.visitTime;
        siteVisits[index].status = 'Rescheduled';
        siteVisits[index].updatedAt = new Date();

        // Add timeline entry
        siteVisits[index].timeline.push({
            id: `timeline-${Date.now()}`,
            action: `Visit rescheduled from ${new Date(oldDate).toLocaleDateString()} to ${new Date(req.body.visitDate).toLocaleDateString()}`,
            user: req.body.user || 'System',
            timestamp: new Date(),
        });

        res.json(siteVisits[index]);
    } else {
        res.status(404).json({ error: 'Visit not found' });
    }
});

// DELETE /site-visits/:id - Cancel visit
app.delete('/site-visits/:id', authMiddleware, (req, res) => {
    const index = siteVisits.findIndex(v => v.id === req.params.id);
    if (index !== -1) {
        siteVisits[index].status = 'Cancelled';
        siteVisits[index].timeline.push({
            id: `timeline-${Date.now()}`,
            action: 'Visit cancelled',
            user: req.body.user || 'System',
            timestamp: new Date(),
        });
        res.json({ message: 'Visit cancelled successfully', visit: siteVisits[index] });
    } else {
        res.status(404).json({ error: 'Visit not found' });
    }
});

// GET /site-visits/calendar - Calendar view data
app.get('/site-visits/calendar', authMiddleware, (req, res) => {
    const { startDate, endDate } = req.query;
    let filtered = [...siteVisits];

    if (startDate && endDate) {
        filtered = filtered.filter(v => {
            const visitDate = new Date(v.visitDate);
            return visitDate >= new Date(startDate) && visitDate <= new Date(endDate);
        });
    }

    // Format for calendar
    const calendarEvents = filtered.map(v => ({
        id: v.id,
        title: `${v.leadName} - ${v.projectName}`,
        start: new Date(v.visitDate),
        end: new Date(new Date(v.visitDate).getTime() + 60 * 60 * 1000), // 1 hour duration
        status: v.status,
        leadName: v.leadName,
        projectName: v.projectName,
        assignedExecutive: v.assignedExecutive,
    }));

    res.json(calendarEvents);
});

// POST /site-visits/:id/outcome - Log visit outcome
app.post('/site-visits/:id/outcome', authMiddleware, (req, res) => {
    const index = siteVisits.findIndex(v => v.id === req.params.id);
    if (index !== -1) {
        siteVisits[index].actualOutcome = req.body.outcome;
        siteVisits[index].notes = req.body.notes || siteVisits[index].notes;
        siteVisits[index].followUpRequired = req.body.followUpRequired;
        siteVisits[index].followUpDate = req.body.followUpDate;
        siteVisits[index].status = 'Completed';
        siteVisits[index].updatedAt = new Date();

        // Add timeline entry
        siteVisits[index].timeline.push({
            id: `timeline-${Date.now()}`,
            action: `Outcome logged: ${req.body.outcome}`,
            user: req.body.user || 'System',
            timestamp: new Date(),
        });

        res.json(siteVisits[index]);
    } else {
        res.status(404).json({ error: 'Visit not found' });
    }
});

// GET /site-visits/:id/timeline - Get visit timeline
app.get('/site-visits/:id/timeline', authMiddleware, (req, res) => {
    const visit = siteVisits.find(v => v.id === req.params.id);
    if (visit) {
        res.json(visit.timeline);
    } else {
        res.status(404).json({ error: 'Visit not found' });
    }
});

// GET /site-visits/:id/files - List attachments
app.get('/site-visits/:id/files', authMiddleware, (req, res) => {
    const visit = siteVisits.find(v => v.id === req.params.id);
    if (visit) {
        res.json(visit.attachments);
    } else {
        res.status(404).json({ error: 'Visit not found' });
    }
});

// POST /site-visits/:id/files - Upload file
app.post('/site-visits/:id/files', authMiddleware, (req, res) => {
    const index = siteVisits.findIndex(v => v.id === req.params.id);
    if (index !== -1) {
        const newFile = {
            id: `file-${Date.now()}`,
            name: req.body.name,
            type: req.body.type,
            url: req.body.url || `/uploads/${req.body.name}`,
            uploadedAt: new Date(),
            uploadedBy: req.body.user || 'System',
        };
        siteVisits[index].attachments.push(newFile);
        res.status(201).json(newFile);
    } else {
        res.status(404).json({ error: 'Visit not found' });
    }
});

// DELETE /site-visits/:id/files/:fileId - Delete file
app.delete('/site-visits/:id/files/:fileId', authMiddleware, (req, res) => {
    const visitIndex = siteVisits.findIndex(v => v.id === req.params.id);
    if (visitIndex !== -1) {
        const fileIndex = siteVisits[visitIndex].attachments.findIndex(f => f.id === req.params.fileId);
        if (fileIndex !== -1) {
            siteVisits[visitIndex].attachments.splice(fileIndex, 1);
            res.json({ message: 'File deleted successfully' });
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    } else {
        res.status(404).json({ error: 'Visit not found' });
    }
});

// POST /site-visits/export - Export visits
app.post('/site-visits/export', authMiddleware, (req, res) => {
    const { format, filters } = req.body;
    res.json({
        success: true,
        message: `Site visits exported as ${format}`,
        downloadUrl: `/downloads/site-visits-${Date.now()}.${format.toLowerCase()}`,
    });
});

// POST /site-visits/email - Email visit report
app.post('/site-visits/email', authMiddleware, (req, res) => {
    const { recipients, format } = req.body;
    res.json({
        success: true,
        message: `Report emailed to ${recipients.length} recipient(s)`,
    });
});

// ==========================================
// USER MANAGEMENT ENDPOINTS
// ==========================================

// Sample users data
// Users and roles moved to top

// GET /users - List users with filters
app.get('/users', authMiddleware, (req, res) => {
    const { role, status, search, page = 1, limit = 10 } = req.query;

    let filtered = [...mockUsers];

    // Apply filters
    if (role && role !== 'All') {
        filtered = filtered.filter(user => user.role === role);
    }
    if (status && status !== 'All') {
        filtered = filtered.filter(user => user.status === status);
    }
    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(user =>
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.phone.includes(searchLower) ||
            user.department.toLowerCase().includes(searchLower)
        );
    }

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = filtered.slice(startIndex, endIndex);

    res.json({
        users: paginatedUsers,
        total: filtered.length,
        page: parseInt(page),
        totalPages: Math.ceil(filtered.length / limit),
    });
});

// GET /users/:id - Get single user
app.get('/users/:id', authMiddleware, (req, res) => {
    const user = mockUsers.find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});

// POST /users - Create user
app.post('/users', authMiddleware, (req, res) => {
    const newUser = {
        id: `user-${Date.now()}`,
        ...req.body,
        joinDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    mockUsers.unshift(newUser);
    res.status(201).json(newUser);
});

// PUT /users/:id - Update user
app.put('/users/:id', authMiddleware, (req, res) => {
    const index = mockUsers.findIndex(u => u.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    mockUsers[index] = {
        ...mockUsers[index],
        ...req.body,
        updatedAt: new Date(),
    };

    res.json(mockUsers[index]);
});

// PATCH /users/:id/status - Update user status
app.patch('/users/:id/status', authMiddleware, (req, res) => {
    const index = mockUsers.findIndex(u => u.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    mockUsers[index].status = req.body.status;
    mockUsers[index].updatedAt = new Date();

    res.json(mockUsers[index]);
});

// DELETE /users/:id - Delete user
app.delete('/users/:id', authMiddleware, (req, res) => {
    const index = mockUsers.findIndex(u => u.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    mockUsers.splice(index, 1);
    res.json({ message: 'User deleted successfully' });
});

// GET /roles - Get available roles
app.get('/roles', authMiddleware, (req, res) => {
    res.json(simpleRoles);
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ GAJRAJAH CRM Backend running on http://localhost:${PORT}`);
    console.log(`📊 Sample projects loaded: ${projects.length}`);
    console.log(`📦 Sample inventory items loaded: ${inventoryItems.length}`);
    console.log(`📋 Sample bookings loaded: ${bookings.length}`);
    console.log(`👥 Sample users loaded: ${mockUsers.length}`);
    console.log(`🔐 Sample roles loaded: ${roles.length}`);
});

