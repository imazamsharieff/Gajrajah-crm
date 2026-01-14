import React from 'react';
import { StatsCardData } from '../../types';

const StatsCard: React.FC<StatsCardData> = ({ title, value, icon, subtitle }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow fade-in">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-500">{subtitle}</p>
                    )}
                </div>
                <div className="p-3 bg-brand-blue bg-opacity-10 rounded-lg">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
