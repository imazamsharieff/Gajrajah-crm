import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Building2, Package, DollarSign, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from '../common/Toast';
import { reportsAPI } from '../../services/reportsService';
import type { OverviewReport, LeadSourceData, MonthlySalesData, SalesFunnel } from '../../types/reports';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const OverviewReports: React.FC = () => {
    const { showToast } = useToast();
    const [overview, setOverview] = useState<OverviewReport | null>(null);
    const [leadSources, setLeadSources] = useState<LeadSourceData[]>([]);
    const [monthlySales, setMonthlySales] = useState<MonthlySalesData[]>([]);
    const [salesFunnel, setSalesFunnel] = useState<SalesFunnel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [overviewData, sourcesData, salesData, funnelData] = await Promise.all([
                reportsAPI.getOverview(),
                reportsAPI.getLeadsBySource(),
                reportsAPI.getMonthlySales(),
                reportsAPI.getSalesFunnel(),
            ]);
            setOverview(overviewData);
            setLeadSources(sourcesData);
            setMonthlySales(salesData);
            setSalesFunnel(funnelData);
        } catch (error) {
            showToast('error', 'Failed to load overview data');
        } finally {
            setLoading(false);
        }
    };

    if (loading || !overview) {
        return <div className="animate-pulse">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Leads</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{overview.totalLeads}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Projects</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{overview.totalProjects}</p>
                        </div>
                        <Building2 className="w-8 h-8 text-purple-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Available Units</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{overview.availableUnits}</p>
                        </div>
                        <Package className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Bookings</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{overview.totalBookings}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-indigo-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Revenue Collected</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">
                                ₹{(overview.revenueCollected / 10000000).toFixed(2)}Cr
                            </p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Revenue Pending</p>
                            <p className="text-2xl font-bold text-amber-600 mt-1">
                                ₹{(overview.revenuePending / 10000000).toFixed(2)}Cr
                            </p>
                        </div>
                        <DollarSign className="w-8 h-8 text-amber-600" />
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lead Sources Pie Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={leadSources}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {leadSources.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Sales Funnel */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Funnel</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesFunnel?.stages || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Monthly Sales Trend */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => `₹${(Number(value) / 100000).toFixed(2)}L`} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default OverviewReports;
