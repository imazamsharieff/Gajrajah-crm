import React from 'react';
import { Building2, Factory, TreePine } from 'lucide-react';
import { ProjectSummary } from '../../types/projects';

interface CategoryStatsProps {
    summary: ProjectSummary;
}

const CategoryStats: React.FC<CategoryStatsProps> = ({ summary }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Residential */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Residential Projects</p>
                        <p className="text-2xl font-bold text-blue-600">{summary.residentialCount}</p>
                    </div>
                </div>
            </div>

            {/* Industrial */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Factory className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Industrial Projects</p>
                        <p className="text-2xl font-bold text-orange-600">{summary.industrialCount}</p>
                    </div>
                </div>
            </div>

            {/* Farm Land */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <TreePine className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Farm Land Projects</p>
                        <p className="text-2xl font-bold text-green-600">{summary.farmlandCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryStats;
