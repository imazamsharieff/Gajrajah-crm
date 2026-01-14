import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Search, ArrowUpDown } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ProjectInventorySummary } from '../types/inventory';
import { inventoryAPI } from '../services/inventoryService';

const ProjectInventorySummaryPage: React.FC = () => {
    const navigate = useNavigate();
    const [projectSummaries, setProjectSummaries] = useState<ProjectInventorySummary[]>([]);
    const [filteredSummaries, setFilteredSummaries] = useState<ProjectInventorySummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [sortBy, setSortBy] = useState<'project_name' | 'available' | 'booked' | 'registered'>('project_name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const loadProjectSummaries = async () => {
        try {
            const data = await inventoryAPI.getProjectSummary();
            setProjectSummaries(data);
            setFilteredSummaries(data);
        } catch (error) {
            console.error('Failed to load project summaries:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjectSummaries();
    }, []);

    // Auto-refresh every 10 seconds
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            loadProjectSummaries();
        }, 10000);

        return () => clearInterval(interval);
    }, [autoRefresh]);

    // Apply filters and sorting
    useEffect(() => {
        let filtered = [...projectSummaries];

        // Category filter
        if (categoryFilter !== 'All') {
            filtered = filtered.filter(p => p.category === categoryFilter);
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.project_name.toLowerCase().includes(query)
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = (bVal as string).toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        setFilteredSummaries(filtered);
    }, [projectSummaries, categoryFilter, searchQuery, sortBy, sortOrder]);

    const handleSort = (column: typeof sortBy) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const handleRowClick = (projectId: string) => {
        navigate(`/inventory/${projectId}`);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
                        <p className="text-gray-600 mt-1">Project-wise inventory summary</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${autoRefresh
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                            Auto-Refresh {autoRefresh ? 'ON' : 'OFF'}
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Sync Inventory
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by project name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                            />
                        </div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                        >
                            <option value="All">All Categories</option>
                            <option value="Residential">Residential</option>
                            <option value="Industrial">Industrial</option>
                            <option value="Farm Land">Farm Land</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading project summaries...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                            Sl No
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('project_name')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Project Name
                                                <ArrowUpDown className="w-4 h-4" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('available')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Available
                                                <ArrowUpDown className="w-4 h-4" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('booked')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Booked
                                                <ArrowUpDown className="w-4 h-4" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('registered')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Registered
                                                <ArrowUpDown className="w-4 h-4" />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredSummaries.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                No projects found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredSummaries.map((summary, index) => (
                                            <tr
                                                key={summary.project_id}
                                                onClick={() => handleRowClick(summary.project_id)}
                                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{index + 1}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {summary.project_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{summary.category}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                                                        {summary.available}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                                                        {summary.booked}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                                                        {summary.registered}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ProjectInventorySummaryPage;
