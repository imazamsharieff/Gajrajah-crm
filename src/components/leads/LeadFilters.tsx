import React from 'react';
import { Search, X } from 'lucide-react';
import { LeadFilters as LeadFiltersType, LeadStatus, LeadSource } from '../../types/leads';
import { availableUsers } from '../../services/leadsService';

interface LeadFiltersProps {
    filters: LeadFiltersType;
    onFilterChange: (filters: LeadFiltersType) => void;
}

const LeadFilters: React.FC<LeadFiltersProps> = ({ filters, onFilterChange }) => {
    const handleReset = () => {
        onFilterChange({
            search: '',
            status: 'all',
            source: 'all',
            assignedTo: 'all',
            dateFrom: null,
            dateTo: null,
        });
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            {/* Search Bar */}
            <div className="mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, phone, or source…"
                        value={filters.search}
                        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange({ ...filters, status: e.target.value as LeadStatus | 'all' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                    >
                        <option value="all">All Statuses</option>
                        {Object.values(LeadStatus).map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Source Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                    <select
                        value={filters.source}
                        onChange={(e) => onFilterChange({ ...filters, source: e.target.value as LeadSource | 'all' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                    >
                        <option value="all">All Sources</option>
                        {Object.values(LeadSource).map((source) => (
                            <option key={source} value={source}>
                                {source}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Assigned To Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                    <select
                        value={filters.assignedTo}
                        onChange={(e) => onFilterChange({ ...filters, assignedTo: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                    >
                        <option value="all">All Users</option>
                        {availableUsers.map((user) => (
                            <option key={user} value={user}>
                                {user}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reset Button */}
                <div className="flex items-end">
                    <button
                        onClick={handleReset}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeadFilters;
