import React from 'react';
import { Package, CheckCircle, XCircle, Clock, Ban } from 'lucide-react';
import { InventorySummary } from '../../types/inventory';

interface InventorySummaryProps {
    summary: InventorySummary;
}

const InventorySummaryComponent: React.FC<InventorySummaryProps> = ({ summary }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {/* Total */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Total Units</p>
                        <p className="text-2xl font-bold text-blue-600">{summary.total}</p>
                    </div>
                </div>
            </div>

            {/* Available */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Available</p>
                        <p className="text-2xl font-bold text-green-600">{summary.available}</p>
                    </div>
                </div>
            </div>

            {/* Sold */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Sold</p>
                        <p className="text-2xl font-bold text-red-600">{summary.sold}</p>
                    </div>
                </div>
            </div>

            {/* Reserved */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Reserved</p>
                        <p className="text-2xl font-bold text-yellow-600">{summary.reserved}</p>
                    </div>
                </div>
            </div>

            {/* Blocked */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Ban className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Blocked</p>
                        <p className="text-2xl font-bold text-gray-600">{summary.blocked}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventorySummaryComponent;
