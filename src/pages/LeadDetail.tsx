import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import LeadOverviewCard from '../components/leads/LeadOverviewCard';
import PipelineProgress from '../components/leads/PipelineProgress';
import ActivityTimeline from '../components/leads/ActivityTimeline';
import LeadFormModal from '../components/leads/LeadFormModal';
import { SiteVisitData } from '../components/leads/ScheduleSiteVisitModal';
import { Lead, Activity, LeadStatus, ActivityType, LeadFormData } from '../types/leads';
import { leadsService } from '../services/leadsService';
import { siteVisitsAPI } from '../services/siteVisitsService';

const LeadDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [lead, setLead] = useState<Lead | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const loadLead = async () => {
        if (!id) return;

        try {
            const leadData = await leadsService.getLead(id);
            if (!leadData) {
                navigate('/leads');
                return;
            }
            setLead(leadData);

            const activitiesData = await leadsService.getActivities(id);
            setActivities(activitiesData);
        } catch (error) {
            console.error('Failed to load lead:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLead();
    }, [id]);

    const handleStatusChange = async (status: LeadStatus) => {
        if (!id) return;

        const updatedLead = await leadsService.updateLeadStatus(id, status);
        if (updatedLead) {
            setLead(updatedLead);
            await loadLead(); // Reload to get updated activities
        }
    };

    const handleAddActivity = async (type: ActivityType, description: string) => {
        if (!id || !lead) return;

        await leadsService.addActivity(id, type, description, lead.assignedTo);
        await loadLead(); // Reload to get updated activities and lead status
    };

    const handleScheduleSiteVisit = async (visitData: SiteVisitData) => {
        if (!id || !lead) return;

        // Format the site visit details into a description
        const formattedDate = new Date(visitData.visitDate).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const description = `Site Visit Scheduled
📅 Date: ${formattedDate}
🕐 Time: ${visitData.visitTime}
🚗 Mode: ${visitData.visitMode}
📝 Details: ${visitData.description}`;

        // Create activity in lead timeline
        await leadsService.addActivity(id, ActivityType.SITE_VISIT, description, lead.assignedTo);

        // Map visit mode to site visit module format
        const visitModeMap: Record<string, 'Onsite' | 'Google Meet' | 'Office Visit'> = {
            'Direct Visit': 'Onsite',
            'Cab': 'Onsite',
            'Others': 'Office Visit',
        };

        // Create site visit entry in Site Visits module
        try {
            await siteVisitsAPI.createVisit({
                leadId: id,
                leadName: lead.name,
                leadPhone: lead.phone,
                leadEmail: lead.email || '',
                projectId: lead.projectsInterested && lead.projectsInterested.length > 0
                    ? lead.projectsInterested[0]
                    : '',
                projectName: lead.projectsInterested && lead.projectsInterested.length > 0
                    ? lead.projectsInterested[0]
                    : 'Not specified',
                preferredPlot: null,
                visitDate: new Date(visitData.visitDate),
                visitTime: visitData.visitTime,
                visitMode: visitModeMap[visitData.visitMode] || 'Onsite',
                assignedExecutive: lead.assignedTo,
                assignedExecutiveId: lead.assignedTo,
                status: 'Scheduled',
                expectedOutcome: visitData.description,
                notes: visitData.description,
                sendReminders: true,
            });
        } catch (error) {
            console.error('Failed to create site visit entry:', error);
        }

        await loadLead(); // Reload to get updated activities and lead status
    };

    const handleEditLead = async (data: LeadFormData) => {
        if (!id) return;

        await leadsService.updateLead(id, data);
        await loadLead();
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!lead) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <p className="text-gray-600">Lead not found</p>
                    <button
                        onClick={() => navigate('/leads')}
                        className="mt-4 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors"
                    >
                        Back to Leads
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/leads')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Leads</span>
                    </button>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors flex items-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit Lead
                    </button>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Overview and Pipeline */}
                    <div className="lg:col-span-1 space-y-6">
                        <LeadOverviewCard lead={lead} onStatusChange={handleStatusChange} />
                        <PipelineProgress currentStatus={lead.status} onStatusChange={handleStatusChange} />
                    </div>

                    {/* Right Column - Activity Timeline */}
                    <div className="lg:col-span-2">
                        <ActivityTimeline
                            activities={activities}
                            onAddActivity={handleAddActivity}
                            onScheduleSiteVisit={handleScheduleSiteVisit}
                        />
                    </div>
                </div>

                {/* Edit Modal */}
                <LeadFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleEditLead}
                    lead={lead}
                />
            </div>
        </DashboardLayout>
    );
};

export default LeadDetail;
