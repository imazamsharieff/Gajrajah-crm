import React, { useState, useEffect } from 'react';
import { Plus, FileDown, Search, Calendar, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useToast } from '../components/common/Toast';
import { siteVisitsAPI } from '../services/siteVisitsService';
import { projectsAPI } from '../services/projectsService';
import type { SiteVisit, VisitFilters } from '../types/siteVisits';
import type { Project } from '../types/projects';

const SiteVisits: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [visits, setVisits] = useState<SiteVisit[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [filters, setFilters] = useState<VisitFilters>({
        project: 'All',
        status: 'All',
        user: 'All',
        fromDate: '',
        toDate: '',
        search: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        loadVisits();
    }, [filters, currentPage]);

    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                loadVisits();
            }, 15000);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, filters, currentPage]);

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

    const loadVisits = async () => {
        try {
            const response = await siteVisitsAPI.getVisits(filters, currentPage, 10);
            setVisits(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            showToast('error', 'Failed to load site visits');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string): string => {
        const colors = {
            'Scheduled': 'bg-blue-100 text-blue-800',
            'Confirmed': 'bg-purple-100 text-purple-800',
            'In Progress': 'bg-yellow-100 text-yellow-800',
            'Completed': 'bg-green-100 text-green-800',
            'No Show': 'bg-red-100 text-red-800',
            'Rescheduled': 'bg-orange-100 text-orange-800',
            'Converted to Booking': 'bg-emerald-100 text-emerald-800',
            'Cancelled': 'bg-gray-100 text-gray-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleExport = (format: string) => {
        showToast('info', `Exporting visits as ${format}...`);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Site Visits</h1>
                        <p className="text-gray-600 mt-1">Manage customer site visits and schedules</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${autoRefresh
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                                }`}
                        >
                            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                            Auto-Refresh {autoRefresh ? 'ON' : 'OFF'}
                        </button>
                        <button
                            onClick={() => handleExport('CSV')}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <FileDown className="w-4 h-4" />
                            Export
                        </button>
                        <button
                            onClick={() => showToast('info', 'Schedule visit form coming soon!')}
                            className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Schedule Visit
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by customer, phone, visit ID..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                />
                            </div>
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
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                        >
                            <option value="All">All Status</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="No Show">No Show</option>
                            <option value="Rescheduled">Rescheduled</option>
                            <option value="Converted to Booking">Converted to Booking</option>
                        </select>

                        <input
                            type="date"
                            value={filters.fromDate}
                            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                            placeholder="From Date"
                        />

                        <input
                            type="date"
                            value={filters.toDate}
                            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                            placeholder="To Date"
                        />
                    </div>
                </div>

                {/* Visits Table */}
                {loading ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading site visits...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Visit ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Project</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Visit Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Executive</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {visits.map((visit) => (
                                        <tr key={visit.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-brand-blue cursor-pointer" onClick={() => navigate(`/site-visits/${visit.id}`)}>
                                                    {visit.id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{visit.leadName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{visit.leadPhone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{visit.projectName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatDate(visit.visitDate)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{visit.visitTime}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{visit.assignedExecutive}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(visit.status)}`}>
                                                    {visit.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => navigate(`/site-visits/${visit.id}`)}
                                                    className="text-brand-blue hover:text-brand-blue-dark"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing page {currentPage} of {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default SiteVisits;
