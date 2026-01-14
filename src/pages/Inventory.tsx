import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Upload, List, Grid, X, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import InventorySummaryComponent from '../components/inventory/InventorySummary';
import { useToast } from '../components/common/Toast';
import {
    Inventory,
    InventoryFilters,
    InventorySummary,
    InventoryFormData,
} from '../types/inventory';
import { inventoryAPI } from '../services/inventoryService';
import { projectsAPI } from '../services/projectsService';
import { Project } from '../types/projects';

const InventoryPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [inventory, setInventory] = useState<Inventory[]>([]);
    const [summary, setSummary] = useState<InventorySummary>({
        total: 0,
        available: 0,
        sold: 0,
        reserved: 0,
        blocked: 0,
    });
    const [filters, setFilters] = useState<InventoryFilters>({
        project: projectId || 'All',
        status: 'All',
        facing: 'All',
        search: '',
        minSize: '',
        maxSize: '',
    });
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState<InventoryFormData>({
        plotNo: '',
        projectId: projectId || '',
        projectName: '',
        dimensionNS: 0,
        dimensionEW: 0,
        facing: 'North' as any,
        status: 'Available' as any,
        price: 0,
        notes: '',
    });
    const [saving, setSaving] = useState(false);

    // Update filters when projectId changes
    useEffect(() => {
        if (projectId) {
            setFilters(prev => ({ ...prev, project: projectId }));
            setFormData(prev => ({ ...prev, projectId }));
        }
    }, [projectId]);

    // Load projects
    useEffect(() => {
        loadProjects();
    }, []);

    // Load current project details
    useEffect(() => {
        if (projectId && projects.length > 0) {
            const project = projects.find(p => p.id === projectId);
            setCurrentProject(project || null);
            if (project) {
                setFormData(prev => ({ ...prev, projectName: project.name }));
            }
        }
    }, [projectId, projects]);

    // Load inventory
    useEffect(() => {
        loadInventory();
    }, [filters, currentPage]);

    // Auto-refresh every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            loadInventory();
        }, 10000);

        return () => clearInterval(interval);
    }, [filters, currentPage]);

    const loadProjects = async () => {
        try {
            const response = await projectsAPI.getProjects(
                { category: 'All', status: 'All', city: 'All', manager: 'All', search: '' },
                1,
                100
            );
            setProjects(response.projects);
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    };

    const loadInventory = async () => {
        try {
            const response = await inventoryAPI.getInventory(filters, currentPage, 10);
            setInventory(response.inventory);
            setTotalPages(response.totalPages);

            // Calculate summary from the full inventory data (not just current page)
            // Get all inventory for this project to calculate accurate totals
            const allInventoryResponse = await inventoryAPI.getInventory(
                filters,
                1,
                1000 // Get all items
            );

            const allItems = allInventoryResponse.inventory;
            setSummary({
                total: allItems.length,
                available: allItems.filter(item => item.status === 'Available').length,
                sold: allItems.filter(item => item.status === 'Sold').length,
                reserved: allItems.filter(item => item.status === 'Reserved').length,
                blocked: allItems.filter(item => item.status === 'Blocked').length,
            });
        } catch (error) {
            console.error('Failed to load inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddInventory = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await inventoryAPI.createInventory(formData);
            showToast('success', 'Inventory added successfully');
            setIsFormOpen(false);
            resetForm();
            await loadInventory();
        } catch (error) {
            console.error('Failed to add inventory:', error);
            showToast('error', 'Failed to add inventory');
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setFormData({
            plotNo: '',
            projectId: '',
            projectName: '',
            dimensionNS: 0,
            dimensionEW: 0,
            facing: 'North' as any,
            status: 'Available' as any,
            price: 0,
            notes: '',
        });
    };

    const handleProjectChange = (projectId: string) => {
        const project = projects.find(p => p.id === projectId);
        setFormData({
            ...formData,
            projectId,
            projectName: project?.name || '',
        });
    };

    const getStatusColor = (status: string): string => {
        const colors = {
            Available: 'bg-green-100 text-green-800',
            Sold: 'bg-red-100 text-red-800',
            Reserved: 'bg-yellow-100 text-yellow-800',
            Blocked: 'bg-gray-100 text-gray-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getFacingColor = (facing: string): string => {
        const colors = {
            North: 'bg-blue-100 text-blue-800',
            South: 'bg-orange-100 text-orange-800',
            East: 'bg-purple-100 text-purple-800',
            West: 'bg-pink-100 text-pink-800',
            Corner: 'bg-indigo-100 text-indigo-800',
        };
        return colors[facing as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const calculatedSize = formData.dimensionNS * formData.dimensionEW;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        {projectId && (
                            <button
                                onClick={() => navigate('/inventory')}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Back to Project Summary</span>
                            </button>
                        )}
                        <h1 className="text-3xl font-bold text-gray-900">
                            {projectId && currentProject ? currentProject.name : 'Inventory'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {projectId ? 'Manage plots for this project' : 'Manage your property inventory'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Bulk Import
                        </button>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Plot
                        </button>
                    </div>
                </div>

                {/* Summary */}
                <InventorySummaryComponent summary={summary} />

                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Search by plot number, facing, or size..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                            />
                        </div>
                        <select
                            value={filters.project}
                            onChange={(e) => setFilters({ ...filters, project: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                        >
                            <option value="All">All Projects</option>
                            {projects.map((proj) => (
                                <option key={proj.id} value={proj.id}>
                                    {proj.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                        >
                            <option value="All">All Status</option>
                            <option value="Available">Available</option>
                            <option value="Sold">Sold</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Blocked">Blocked</option>
                        </select>
                        <select
                            value={filters.facing}
                            onChange={(e) => setFilters({ ...filters, facing: e.target.value as any })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                        >
                            <option value="All">All Facing</option>
                            <option value="North">North</option>
                            <option value="South">South</option>
                            <option value="East">East</option>
                            <option value="West">West</option>
                            <option value="Corner">Corner</option>
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${viewMode === 'list'
                                    ? 'bg-brand-blue text-white'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                                List
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${viewMode === 'map'
                                    ? 'bg-brand-blue text-white'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Grid className="w-4 h-4" />
                                Map
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading inventory...</p>
                    </div>
                ) : viewMode === 'list' ? (
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Plot No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Project</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Dimensions</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Size</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Facing</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {inventory.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{item.plotNo}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{item.projectName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {item.dimensionNS} × {item.dimensionEW} ft
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{item.size} sqft</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFacingColor(item.facing)}`}>
                                                    {item.facing}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    ₹{item.price.toLocaleString('en-IN')}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {inventory.map((item) => (
                                <div
                                    key={item.id}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${item.status === 'Available'
                                        ? 'border-green-500 bg-green-50'
                                        : item.status === 'Sold'
                                            ? 'border-red-500 bg-red-50'
                                            : item.status === 'Reserved'
                                                ? 'border-yellow-500 bg-yellow-50'
                                                : 'border-gray-500 bg-gray-50'
                                        }`}
                                    title={`${item.plotNo} - ${item.size} sqft - ${item.facing} - ₹${item.price.toLocaleString('en-IN')}`}
                                >
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-gray-900">{item.plotNo}</div>
                                        <div className="text-xs text-gray-600 mt-1">{item.size} sqft</div>
                                        <div className="text-xs text-gray-600">{item.facing}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add Inventory Form Drawer */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end z-50">
                        <div className="bg-white w-full max-w-2xl h-full overflow-y-auto slide-in-right">
                            {/* Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                                <h2 className="text-2xl font-bold text-gray-900">Add New Inventory</h2>
                                <button
                                    onClick={() => {
                                        setIsFormOpen(false);
                                        resetForm();
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleAddInventory} className="p-6 space-y-6">
                                {/* Project Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Project <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.projectId}
                                        onChange={(e) => handleProjectChange(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                    >
                                        <option value="">Select Project</option>
                                        {projects.map((proj) => (
                                            <option key={proj.id} value={proj.id}>
                                                {proj.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Plot Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Plot Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.plotNo}
                                        onChange={(e) => setFormData({ ...formData, plotNo: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                        placeholder="e.g., A001, W005, P010"
                                    />
                                </div>

                                {/* Dimensions */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Dimension NS (ft) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.dimensionNS || ''}
                                            onChange={(e) => setFormData({ ...formData, dimensionNS: parseInt(e.target.value) || 0 })}
                                            required
                                            min="1"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Dimension EW (ft) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.dimensionEW || ''}
                                            onChange={(e) => setFormData({ ...formData, dimensionEW: parseInt(e.target.value) || 0 })}
                                            required
                                            min="1"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Auto-calculated Size */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Size (sqft) - Auto-calculated
                                    </label>
                                    <input
                                        type="text"
                                        value={calculatedSize || 0}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                    />
                                </div>

                                {/* Facing */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Facing</label>
                                    <select
                                        value={formData.facing}
                                        onChange={(e) => setFormData({ ...formData, facing: e.target.value as any })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                    >
                                        <option value="North">North</option>
                                        <option value="South">South</option>
                                        <option value="East">East</option>
                                        <option value="West">West</option>
                                        <option value="Corner">Corner</option>
                                    </select>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                    >
                                        <option value="Available">Available</option>
                                        <option value="Sold">Sold</option>
                                        <option value="Reserved">Reserved</option>
                                        <option value="Blocked">Blocked</option>
                                    </select>
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price (₹) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price || ''}
                                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                        required
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                        placeholder="e.g., 4500000"
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none resize-none"
                                        placeholder="Additional notes..."
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsFormOpen(false);
                                            resetForm();
                                        }}
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? 'Saving...' : 'Add Inventory'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default InventoryPage;
