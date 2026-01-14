import React, { useState } from 'react';
import { Plus, Phone, MessageCircle, Mail, MapPin, Clock, FileText, X, Calendar } from 'lucide-react';
import { Activity, ActivityType } from '../../types/leads';
import { getRelativeTime } from '../../utils/dateHelpers';
import ScheduleSiteVisitModal, { SiteVisitData } from './ScheduleSiteVisitModal';

interface ActivityTimelineProps {
    activities: Activity[];
    onAddActivity: (type: ActivityType, description: string) => Promise<void>;
    onScheduleSiteVisit?: (visitData: SiteVisitData) => Promise<void>;
}

const getActivityIcon = (type: ActivityType) => {
    const icons = {
        [ActivityType.CALL]: Phone,
        [ActivityType.NOTE]: FileText,
        [ActivityType.WHATSAPP]: MessageCircle,
        [ActivityType.EMAIL]: Mail,
        [ActivityType.SITE_VISIT]: MapPin,
        [ActivityType.FOLLOW_UP]: Clock,
    };
    return icons[type];
};

const getActivityColor = (type: ActivityType) => {
    const colors = {
        [ActivityType.CALL]: 'bg-blue-100 text-blue-600',
        [ActivityType.NOTE]: 'bg-gray-100 text-gray-600',
        [ActivityType.WHATSAPP]: 'bg-green-100 text-green-600',
        [ActivityType.EMAIL]: 'bg-purple-100 text-purple-600',
        [ActivityType.SITE_VISIT]: 'bg-orange-100 text-orange-600',
        [ActivityType.FOLLOW_UP]: 'bg-yellow-100 text-yellow-600',
    };
    return colors[type];
};

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, onAddActivity, onScheduleSiteVisit }) => {
    const [showForm, setShowForm] = useState(false);
    const [showSiteVisitModal, setShowSiteVisitModal] = useState(false);
    const [activityType, setActivityType] = useState<ActivityType>(ActivityType.NOTE);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;

        setLoading(true);
        try {
            await onAddActivity(activityType, description);
            setDescription('');
            setShowForm(false);
        } catch (error) {
            console.error('Failed to add activity:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleScheduleSiteVisit = async (visitData: SiteVisitData) => {
        if (onScheduleSiteVisit) {
            await onScheduleSiteVisit(visitData);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowSiteVisitModal(true)}
                        className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-1 text-sm"
                    >
                        <Calendar className="w-4 h-4" />
                        Schedule Site Visit
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-3 py-1 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors flex items-center gap-1 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Activity
                    </button>
                </div>
            </div>

            {/* Add Activity Form */}
            {showForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">New Activity</h4>
                        <button
                            onClick={() => setShowForm(false)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Activity Type
                            </label>
                            <select
                                value={activityType}
                                onChange={(e) => setActivityType(e.target.value as ActivityType)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                            >
                                {Object.values(ActivityType).map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none resize-none"
                                placeholder="Enter activity details..."
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors disabled:opacity-50 text-sm"
                            >
                                {loading ? 'Adding...' : 'Add Activity'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Timeline */}
            <div className="space-y-4">
                {activities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>No activities yet</p>
                        <p className="text-sm">Add your first activity to start tracking</p>
                    </div>
                ) : (
                    activities.map((activity, index) => {
                        const Icon = getActivityIcon(activity.type);
                        const colorClass = getActivityColor(activity.type);

                        return (
                            <div key={activity.id} className="flex gap-3">
                                {/* Timeline Line */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    {index < activities.length - 1 && (
                                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                                    )}
                                </div>

                                {/* Activity Content */}
                                <div className="flex-1 pb-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{activity.type}</p>
                                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                        <span>{activity.createdBy}</span>
                                        <span>•</span>
                                        <span>{getRelativeTime(activity.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Schedule Site Visit Modal */}
            <ScheduleSiteVisitModal
                isOpen={showSiteVisitModal}
                onClose={() => setShowSiteVisitModal(false)}
                onSchedule={handleScheduleSiteVisit}
            />
        </div>
    );
};

export default ActivityTimeline;
