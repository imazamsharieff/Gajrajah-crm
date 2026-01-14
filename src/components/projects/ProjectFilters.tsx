import React from 'react';
import { Search } from 'lucide-react';
import { ProjectFilters, ProjectCategory, ProjectStatus } from '../../types/projects';

interface ProjectFiltersProps {
    filters: ProjectFilters;
    onFilterChange: (filters: ProjectFilters) => void;
    cities: string[];
    managers: string[];
}

const ProjectFiltersComponent: React.FC<ProjectFiltersProps> = ({
    filters,
    onFilterChange,
    cities,
    managers,
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            {/* Search Bar */}
            <div className="mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by project name, location, category…"
                        value={filters.search}
                        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        value={filters.category}
                        onChange={(e) =>
                            onFilterChange({ ...filters, category: e.target.value as ProjectCategory | 'All' })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                    >
                        <option value="All">All Categories</option>
                        {Object.values(ProjectCategory).map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) =>
                            onFilterChange({ ...filters, status: e.target.value as ProjectStatus | 'All' })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                    >
                        <option value="All">All Statuses</option>
                        {Object.values(ProjectStatus).map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {/* City Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <select
                        value={filters.city}
                        onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                    >
                        <option value="All">All Cities</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Manager Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Manager</label>
                    <select
                        value={filters.manager}
                        onChange={(e) => onFilterChange({ ...filters, manager: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                    >
                        <option value="All">All Managers</option>
                        {managers.map((manager) => (
                            <option key={manager} value={manager}>
                                {manager}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ProjectFiltersComponent;
