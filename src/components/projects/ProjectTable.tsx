import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Project, ProjectCategory, ProjectStatus } from '../../types/projects';
import { formatDate } from '../../utils/dateHelpers';

interface ProjectTableProps {
    projects: Project[];
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    sortBy: string;
    sortOrder: string;
    onSort: (field: string) => void;
}

const getCategoryColor = (category: ProjectCategory): string => {
    const colors = {
        [ProjectCategory.RESIDENTIAL]: 'bg-blue-100 text-blue-800',
        [ProjectCategory.INDUSTRIAL]: 'bg-orange-100 text-orange-800',
        [ProjectCategory.FARM_LAND]: 'bg-green-100 text-green-800',
    };
    return colors[category];
};

const getStatusColor = (status: ProjectStatus): string => {
    const colors = {
        [ProjectStatus.ACTIVE]: 'bg-green-100 text-green-800',
        [ProjectStatus.LAUNCHING_SOON]: 'bg-blue-100 text-blue-800',
        [ProjectStatus.SOLD_OUT]: 'bg-red-100 text-red-800',
        [ProjectStatus.ON_HOLD]: 'bg-gray-100 text-gray-800',
    };
    return colors[status];
};

const ProjectTable: React.FC<ProjectTableProps> = ({
    projects,
    onEdit,
    onDelete,
    currentPage,
    totalPages,
    onPageChange,
    sortBy,
    sortOrder,
    onSort,
}) => {
    const navigate = useNavigate();

    const SortIcon: React.FC<{ field: string }> = ({ field }) => {
        if (sortBy !== field) return null;
        return sortOrder === 'asc' ? (
            <ChevronUp className="w-4 h-4" />
        ) : (
            <ChevronDown className="w-4 h-4" />
        );
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th
                                onClick={() => onSort('name')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-1">
                                    Project Name
                                    <SortIcon field="name" />
                                </div>
                            </th>
                            <th
                                onClick={() => onSort('category')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-1">
                                    Category
                                    <SortIcon field="category" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Total Units
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Available Units
                            </th>
                            <th
                                onClick={() => onSort('status')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-1">
                                    Status
                                    <SortIcon field="status" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Assigned Manager
                            </th>
                            <th
                                onClick={() => onSort('createdAt')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-1">
                                    Created On
                                    <SortIcon field="createdAt" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {projects.map((project) => (
                            <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                                            project.category
                                        )}`}
                                    >
                                        {project.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {project.city}, {project.state}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{project.totalUnits}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{project.availableUnits}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                            project.status
                                        )}`}
                                    >
                                        {project.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{project.assignedManager}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{formatDate(new Date(project.createdAt))}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => navigate(`/projects/${project.id}`)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            title="View"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(project)}
                                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(project.id)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
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
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`px-3 py-1 border rounded-lg text-sm transition-colors ${currentPage === page
                                            ? 'bg-brand-blue text-white border-brand-blue'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectTable;
