import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Lead, LeadStatus } from '../../types/leads';
import { formatPhoneNumber } from '../../utils/phoneFormatter';
import { formatDate } from '../../utils/dateHelpers';

interface LeadTableProps {
    leads: Lead[];
    onEdit: (lead: Lead) => void;
    onDelete: (id: string) => void;
}

type SortField = 'name' | 'phone' | 'email' | 'source' | 'assignedTo' | 'status' | 'lastFollowUp' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const getStatusColor = (status: LeadStatus): string => {
    const colors: Record<LeadStatus, string> = {
        [LeadStatus.NEW]: 'bg-blue-100 text-blue-800',
        [LeadStatus.FOLLOW_UP]: 'bg-yellow-100 text-yellow-800',
        [LeadStatus.SITE_VISIT_SCHEDULED]: 'bg-purple-100 text-purple-800',
        [LeadStatus.NEGOTIATION]: 'bg-orange-100 text-orange-800',
        [LeadStatus.BOOKING]: 'bg-indigo-100 text-indigo-800',
        [LeadStatus.REGISTRATION]: 'bg-teal-100 text-teal-800',
        [LeadStatus.CLOSED_WON]: 'bg-green-100 text-green-800',
        [LeadStatus.LOST]: 'bg-red-100 text-red-800',
    };
    return colors[status];
};

const LeadTable: React.FC<LeadTableProps> = ({ leads, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [sortField, setSortField] = useState<SortField>('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedLeads = [...leads].sort((a, b) => {
        let aValue: any = a[sortField];
        let bValue: any = b[sortField];

        if (sortField === 'lastFollowUp') {
            aValue = a.lastFollowUp?.getTime() || 0;
            bValue = b.lastFollowUp?.getTime() || 0;
        } else if (sortField === 'createdAt') {
            aValue = a.createdAt.getTime();
            bValue = b.createdAt.getTime();
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);
    const paginatedLeads = sortedLeads.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const SortIcon: React.FC<{ field: SortField }> = ({ field }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? (
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
                                onClick={() => handleSort('name')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-1">
                                    Lead Name
                                    <SortIcon field="name" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('phone')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-1">
                                    Phone
                                    <SortIcon field="phone" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('email')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-1">
                                    Email
                                    <SortIcon field="email" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('source')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-1">
                                    Source
                                    <SortIcon field="source" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('assignedTo')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-1">
                                    Assigned To
                                    <SortIcon field="assignedTo" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('status')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-1">
                                    Status
                                    <SortIcon field="status" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('lastFollowUp')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-1">
                                    Last Follow-up
                                    <SortIcon field="lastFollowUp" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('createdAt')}
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
                        {paginatedLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{formatPhoneNumber(lead.phone)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{lead.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{lead.source}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{lead.assignedTo}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {lead.lastFollowUp ? formatDate(lead.lastFollowUp) : '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{formatDate(lead.createdAt)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => navigate(`/leads/${lead.id}`)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            title="View"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(lead)}
                                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to delete ${lead.name}?`)) {
                                                    onDelete(lead.id);
                                                }
                                            }}
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
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                        {Math.min(currentPage * itemsPerPage, leads.length)} of {leads.length} leads
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 border rounded-lg text-sm transition-colors ${currentPage === page
                                        ? 'bg-brand-blue text-white border-brand-blue'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

export default LeadTable;
