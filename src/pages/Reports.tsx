import React, { useState } from 'react';
import { BarChart3, FileDown, RefreshCw } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import OverviewReports from '../components/reports/OverviewReports';
import LeadsReports from '../components/reports/LeadsReports';
import BookingsReports from '../components/reports/BookingsReports';
import { useToast } from '../components/common/Toast';

type ReportTab = 'overview' | 'leads' | 'bookings';

const Reports: React.FC = () => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<ReportTab>('overview');
    const [autoRefresh, setAutoRefresh] = useState(false);

    const tabs = [
        { id: 'overview' as ReportTab, label: '📈 Overview Reports', icon: BarChart3 },
        { id: 'leads' as ReportTab, label: '👥 Leads Reports', icon: BarChart3 },
        { id: 'bookings' as ReportTab, label: '🧾 Bookings & Sales', icon: BarChart3 },
    ];

    const handleExport = (format: string) => {
        showToast('info', `Exporting report as ${format}...`);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewReports />;
            case 'leads':
                return <LeadsReports />;
            case 'bookings':
                return <BookingsReports />;
            default:
                return <OverviewReports />;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                        <p className="text-gray-600 mt-1">Comprehensive business insights and metrics</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${autoRefresh
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                                }`}
                        >
                            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                            Auto-Refresh {autoRefresh ? 'ON' : 'OFF'}
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleExport('CSV')}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <FileDown className="w-4 h-4" />
                                CSV
                            </button>
                            <button
                                onClick={() => handleExport('Excel')}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <FileDown className="w-4 h-4" />
                                Excel
                            </button>
                            <button
                                onClick={() => handleExport('PDF')}
                                className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors flex items-center gap-2"
                            >
                                <FileDown className="w-4 h-4" />
                                PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex gap-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? 'border-brand-blue text-brand-blue'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div>{renderContent()}</div>
            </div>
        </DashboardLayout>
    );
};

export default Reports;
