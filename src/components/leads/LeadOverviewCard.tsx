import React from 'react';
import { Phone, Mail, MapPin, User, Tag } from 'lucide-react';
import { Lead, LeadStatus } from '../../types/leads';
import { formatPhoneNumber } from '../../utils/phoneFormatter';

interface LeadOverviewCardProps {
    lead: Lead;
    onStatusChange: (status: LeadStatus) => void;
}

const getStatusColor = (status: LeadStatus): string => {
    const colors: Record<LeadStatus, string> = {
        [LeadStatus.NEW]: 'bg-blue-100 text-blue-800 border-blue-200',
        [LeadStatus.FOLLOW_UP]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        [LeadStatus.SITE_VISIT_SCHEDULED]: 'bg-purple-100 text-purple-800 border-purple-200',
        [LeadStatus.NEGOTIATION]: 'bg-orange-100 text-orange-800 border-orange-200',
        [LeadStatus.BOOKING]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        [LeadStatus.REGISTRATION]: 'bg-teal-100 text-teal-800 border-teal-200',
        [LeadStatus.CLOSED_WON]: 'bg-green-100 text-green-800 border-green-200',
        [LeadStatus.LOST]: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status];
};

const LeadOverviewCard: React.FC<LeadOverviewCardProps> = ({ lead, onStatusChange }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{lead.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">Lead ID: {lead.id}</p>
                </div>
                <select
                    value={lead.status}
                    onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
                    className={`px-3 py-1 text-sm font-medium rounded-full border-2 outline-none cursor-pointer ${getStatusColor(
                        lead.status
                    )}`}
                >
                    {Object.values(LeadStatus).map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <a
                            href={`tel:+91${lead.phone}`}
                            className="text-sm font-medium text-brand-blue hover:underline"
                        >
                            {formatPhoneNumber(lead.phone)}
                        </a>
                    </div>
                </div>

                {/* Email */}
                {lead.email && (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <a
                                href={`mailto:${lead.email}`}
                                className="text-sm font-medium text-brand-blue hover:underline"
                            >
                                {lead.email}
                            </a>
                        </div>
                    </div>
                )}

                {/* Lead Source */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Lead Source</p>
                        <p className="text-sm font-medium text-gray-900">{lead.source}</p>
                    </div>
                </div>

                {/* Assigned To */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Assigned To</p>
                        <p className="text-sm font-medium text-gray-900">{lead.assignedTo}</p>
                    </div>
                </div>

                {/* Projects Interested */}
                {lead.projectsInterested.length > 0 && (
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Tag className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-2">Projects Interested</p>
                            <div className="flex flex-wrap gap-2">
                                {lead.projectsInterested.map((project) => (
                                    <span
                                        key={project}
                                        className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
                                    >
                                        {project}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Notes */}
                {lead.notes && (
                    <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Notes</p>
                        <p className="text-sm text-gray-700">{lead.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadOverviewCard;
