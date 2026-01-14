import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, MapPin, Clock } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useToast } from '../components/common/Toast';
import { siteVisitsAPI } from '../services/siteVisitsService';
import type { SiteVisit } from '../types/siteVisits';

const SiteVisitDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [visit, setVisit] = useState<SiteVisit | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadVisit();
        }
    }, [id]);

    const loadVisit = async () => {
        try {
            const data = await siteVisitsAPI.getVisit(id!);
            setVisit(data);
        } catch (error) {
            showToast('error', 'Failed to load visit details');
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
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="animate-pulse">Loading...</div>
            </DashboardLayout>
        );
    }

    if (!visit) {
        return (
            <DashboardLayout>
                <div>Visit not found</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/site-visits')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{visit.id}</h1>
                        <p className="text-gray-600 mt-1">Site Visit Details</p>
                    </div>
                </div>

                {/* Visit Overview Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Visit Overview</h2>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(visit.status)}`}>
                            {visit.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">{visit.leadName}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <div className="text-gray-900">{visit.leadPhone}</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="text-gray-900">{visit.leadEmail}</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">{visit.projectName}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">{new Date(visit.visitDate).toLocaleDateString('en-IN')}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Visit Time</label>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">{visit.visitTime}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Visit Mode</label>
                            <div className="text-gray-900">{visit.visitMode}</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Executive</label>
                            <div className="text-gray-900">{visit.assignedExecutive}</div>
                        </div>

                        {visit.preferredPlot && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Plot</label>
                                <div className="text-gray-900">{visit.preferredPlot}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes & Outcome */}
                {visit.status === 'Completed' && visit.actualOutcome && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Visit Outcome</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                                <div className="text-gray-900">{visit.actualOutcome}</div>
                            </div>
                            {visit.notes && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                    <div className="text-gray-900">{visit.notes}</div>
                                </div>
                            )}
                            {visit.followUpRequired && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Required</label>
                                    <div className="text-gray-900">Yes {visit.followUpDate && `- ${new Date(visit.followUpDate).toLocaleDateString('en-IN')}`}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Timeline */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
                    <div className="space-y-4">
                        {visit.timeline.map((entry) => (
                            <div key={entry.id} className="flex gap-4">
                                <div className="w-2 h-2 bg-brand-blue rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">{entry.action}</div>
                                    <div className="text-xs text-gray-600">
                                        {entry.user} • {new Date(entry.timestamp).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SiteVisitDetail;
