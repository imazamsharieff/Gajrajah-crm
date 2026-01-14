import React, { useState, useEffect } from 'react';
import { Plus, FileDown, Search, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useToast } from '../components/common/Toast';
import { bookingsAPI } from '../services/bookingsService';
import { projectsAPI } from '../services/projectsService';
import type { Booking, BookingFilters, BookingSummary } from '../types/bookings';
import type { Project } from '../types/projects';

const Bookings: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [summary, setSummary] = useState<BookingSummary>({
        total: 0,
        confirmed: 0,
        pendingPayments: 0,
        registered: 0,
        cancelled: 0,
    });
    const [filters, setFilters] = useState<BookingFilters>({
        project: 'All',
        category: 'All',
        status: 'All',
        sales: 'All',
        fromDate: '',
        toDate: '',
        search: '',
    });
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        loadBookings();
        loadSummary();
    }, [filters, currentPage]);

    // Auto-refresh every 15 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            loadBookings();
            loadSummary();
        }, 15000);
        return () => clearInterval(interval);
    }, [filters, currentPage]);

    const loadProjects = async () => {
        try {
            const response = await projectsAPI.getProjects(
                { category: 'All', status: 'All', city: 'All', manager: 'All', search: '' },
                1,
                100
            );
            setProjects(response.projects);
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    };

    const loadBookings = async () => {
        try {
            const response = await bookingsAPI.getBookings(filters, currentPage, 10);
            setBookings(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSummary = async () => {
        try {
            const summaryData = await bookingsAPI.getSummary();
            setSummary(summaryData);
        } catch (error) {
            console.error('Failed to load summary:', error);
        }
    };

    const getStatusColor = (status: string): string => {
        const colors = {
            'Token Paid': 'bg-blue-100 text-blue-800',
            'Agreement Drafted': 'bg-indigo-100 text-indigo-800',
            'Agreement Signed': 'bg-purple-100 text-purple-800',
            'Part Payment': 'bg-amber-100 text-amber-800',
            'Full Payment': 'bg-green-100 text-green-800',
            'Registered': 'bg-emerald-100 text-emerald-800',
            'Cancelled': 'bg-red-100 text-red-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
                        <p className="text-gray-600 mt-1">Manage customer bookings and agreements</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <FileDown className="w-4 h-4" />
                            Export Bookings
                        </button>
                        <button
                            onClick={() => showToast('info', 'New booking form coming soon!')}
                            className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Booking
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Confirmed</p>
                                <p className="text-2xl font-bold text-purple-600 mt-1">{summary.confirmed}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending Payments</p>
                                <p className="text-2xl font-bold text-amber-600 mt-1">{summary.pendingPayments}</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Registered</p>
                                <p className="text-2xl font-bold text-emerald-600 mt-1">{summary.registered}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Cancelled</p>
                                <p className="text-2xl font-bold text-red-600 mt-1">{summary.cancelled}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by customer, phone, booking ID..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        <select
                            value={filters.project}
                            onChange={(e) => setFilters({ ...filters, project: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                        >
                            <option value="All">All Projects</option>
                            {projects.map((proj) => (
                                <option key={proj.id} value={proj.id}>
                                    {proj.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                        >
                            <option value="All">All Categories</option>
                            <option value="Residential">Residential</option>
                            <option value="Industrial">Industrial</option>
                            <option value="Farm Land">Farm Land</option>
                        </select>

                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                        >
                            <option value="All">All Status</option>
                            <option value="Token Paid">Token Paid</option>
                            <option value="Agreement Drafted">Agreement Drafted</option>
                            <option value="Agreement Signed">Agreement Signed</option>
                            <option value="Part Payment">Part Payment</option>
                            <option value="Full Payment">Full Payment</option>
                            <option value="Registered">Registered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>

                        <select
                            value={filters.sales}
                            onChange={(e) => setFilters({ ...filters, sales: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                        >
                            <option value="All">All Sales</option>
                            <option value="Rajesh Kumar">Rajesh Kumar</option>
                            <option value="Priya Sharma">Priya Sharma</option>
                            <option value="Amit Patel">Amit Patel</option>
                            <option value="Sneha Reddy">Sneha Reddy</option>
                        </select>
                    </div>
                </div>

                {/* Bookings Table */}
                {loading ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading bookings...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Booking ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Project</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Plot No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Total Value</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Balance</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Sales</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {bookings.map((booking) => (
                                        <tr
                                            key={booking.id}
                                            onClick={() => navigate(`/bookings/${booking.id}`)}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-brand-blue">{booking.id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{booking.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{booking.projectName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{booking.plotNo}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{booking.category}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatDate(booking.bookingDate)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    ₹{booking.netAmount.toLocaleString('en-IN')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-amber-600">
                                                    ₹{booking.balance.toLocaleString('en-IN')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{booking.salesExecutive}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Bookings;
