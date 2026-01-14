import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatsCard from '../components/dashboard/StatsCard';
import LeadSourceChart from '../components/dashboard/LeadSourceChart';
import SalesFunnelChart from '../components/dashboard/SalesFunnelChart';
import { Users, Clock, MapPin, Calendar, Package } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalLeads: 328,
        todayFollowups: 14,
        upcomingSiteVisits: 6,
        bookingsConfirmed: 12,
        inventoryTotal: 423,
        inventoryAvailable: 218,
        inventorySold: 205,
    });

    // Auto-update stats every 8-10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setStats((prev) => ({
                totalLeads: prev.totalLeads + Math.floor(Math.random() * 3),
                todayFollowups: Math.max(0, prev.todayFollowups + Math.floor(Math.random() * 3) - 1),
                upcomingSiteVisits: Math.max(0, prev.upcomingSiteVisits + Math.floor(Math.random() * 2) - 1),
                bookingsConfirmed: prev.bookingsConfirmed + Math.floor(Math.random() * 2),
                inventoryTotal: prev.inventoryTotal,
                inventoryAvailable: Math.max(0, prev.inventoryAvailable - Math.floor(Math.random() * 2)),
                inventorySold: prev.inventorySold + Math.floor(Math.random() * 2),
            }));
        }, 8000 + Math.random() * 2000); // 8-10 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Leads"
                        value={stats.totalLeads}
                        icon={<Users className="w-6 h-6 text-brand-blue" />}
                    />
                    <StatsCard
                        title="Today's Follow-ups"
                        value={stats.todayFollowups}
                        icon={<Clock className="w-6 h-6 text-brand-blue" />}
                    />
                    <StatsCard
                        title="Upcoming Site Visits"
                        value={stats.upcomingSiteVisits}
                        icon={<MapPin className="w-6 h-6 text-brand-blue" />}
                    />
                    <StatsCard
                        title="Bookings Confirmed"
                        value={stats.bookingsConfirmed}
                        icon={<Calendar className="w-6 h-6 text-brand-blue" />}
                    />
                </div>

                {/* Inventory Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-brand-blue bg-opacity-10 rounded-lg">
                            <Package className="w-6 h-6 text-brand-blue" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Inventory Overview</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.inventoryTotal}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Available</p>
                            <p className="text-2xl font-bold text-green-600">{stats.inventoryAvailable}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Sold</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.inventorySold}</p>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LeadSourceChart />
                    <SalesFunnelChart />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
