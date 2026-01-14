import React from 'react';
import { LeadStatus } from '../../types/leads';

interface PipelineProgressProps {
    currentStatus: LeadStatus;
    onStatusChange: (status: LeadStatus) => void;
}

const stages: { status: LeadStatus; color: string }[] = [
    { status: LeadStatus.NEW, color: 'bg-blue-500' },
    { status: LeadStatus.FOLLOW_UP, color: 'bg-yellow-500' },
    { status: LeadStatus.SITE_VISIT_SCHEDULED, color: 'bg-purple-500' },
    { status: LeadStatus.NEGOTIATION, color: 'bg-orange-500' },
    { status: LeadStatus.BOOKING, color: 'bg-indigo-500' },
    { status: LeadStatus.REGISTRATION, color: 'bg-teal-500' },
    { status: LeadStatus.CLOSED_WON, color: 'bg-green-500' },
];

const PipelineProgress: React.FC<PipelineProgressProps> = ({ currentStatus, onStatusChange }) => {
    const currentIndex = stages.findIndex((s) => s.status === currentStatus);
    const isLost = currentStatus === LeadStatus.LOST;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Progress</h3>

            {/* Status Dropdown */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Status
                </label>
                <select
                    value={currentStatus}
                    onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                >
                    {Object.values(LeadStatus).map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {/* Pipeline Visualization */}
            {!isLost ? (
                <div className="space-y-3">
                    {stages.map((stage, index) => {
                        const isActive = index <= currentIndex;
                        const isCurrent = stage.status === currentStatus;

                        return (
                            <div
                                key={stage.status}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${isCurrent ? 'bg-blue-50 border-2 border-brand-blue' : 'hover:bg-gray-50'
                                    }`}
                                onClick={() => onStatusChange(stage.status)}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${isActive ? stage.color : 'bg-gray-300'
                                        }`}
                                >
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium ${isCurrent ? 'text-brand-blue' : 'text-gray-900'}`}>
                                        {stage.status}
                                    </p>
                                    {isCurrent && (
                                        <p className="text-xs text-gray-500">Current Stage</p>
                                    )}
                                </div>
                                {isActive && (
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                        ✕
                    </div>
                    <p className="text-lg font-semibold text-red-900">Lead Lost</p>
                    <p className="text-sm text-red-700 mt-1">This lead has been marked as lost</p>
                </div>
            )}
        </div>
    );
};

export default PipelineProgress;
