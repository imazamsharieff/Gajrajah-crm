import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CreditCard, Upload, Clock, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useToast } from '../components/common/Toast';
import { bookingsAPI } from '../services/bookingsService';
import type { Booking, Payment, BookingDocument, TimelineEntry } from '../types/bookings';

const BookingDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [documents, setDocuments] = useState<BookingDocument[]>([]);
    const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'documents' | 'timeline'>('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadBookingData();
        }
    }, [id]);

    const loadBookingData = async () => {
        try {
            const [bookingData, paymentsData, documentsData, timelineData] = await Promise.all([
                bookingsAPI.getBooking(id!),
                bookingsAPI.getPayments(id!),
                bookingsAPI.getDocuments(id!),
                bookingsAPI.getTimeline(id!),
            ]);
            setBooking(bookingData);
            setPayments(paymentsData);
            setDocuments(documentsData);
            setTimeline(timelineData);
        } catch (error) {
            console.error('Failed to load booking:', error);
            showToast('error', 'Failed to load booking details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            await bookingsAPI.updateStatus(id!, newStatus);
            showToast('success', `Status updated to ${newStatus}`);
            loadBookingData();
        } catch (error) {
            showToast('error', 'Failed to update status');
        }
    };

    const handleCancelBooking = async () => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        const reason = prompt('Reason for cancellation:');
        if (!reason) return;

        try {
            await bookingsAPI.cancelBooking(id!, reason, 0);
            showToast('success', 'Booking cancelled successfully');
            loadBookingData();
        } catch (error) {
            showToast('error', 'Failed to cancel booking');
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

    const formatDate = (date: Date | string | null) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!booking) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <p className="text-gray-600">Booking not found</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/bookings')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-gray-900">{booking.id}</h1>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>
                            <p className="text-gray-600 mt-1">{booking.customerName} • {booking.phone}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {booking.status === 'Token Paid' && (
                            <button
                                onClick={() => handleStatusChange('Agreement Drafted')}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Mark Agreement Drafted
                            </button>
                        )}
                        {booking.status === 'Agreement Drafted' && (
                            <button
                                onClick={() => handleStatusChange('Agreement Signed')}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Mark Agreement Signed
                            </button>
                        )}
                        {['Agreement Signed', 'Part Payment', 'Full Payment'].includes(booking.status) && (
                            <button
                                onClick={() => handleStatusChange('Registered')}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Mark as Registered
                            </button>
                        )}
                        {booking.status !== 'Cancelled' && booking.status !== 'Registered' && (
                            <button
                                onClick={handleCancelBooking}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Cancel Booking
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'overview'
                                    ? 'border-brand-blue text-brand-blue'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Overview
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'payments'
                                    ? 'border-brand-blue text-brand-blue'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Payments
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'documents'
                                    ? 'border-brand-blue text-brand-blue'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Documents
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('timeline')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'timeline'
                                    ? 'border-brand-blue text-brand-blue'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Timeline
                            </div>
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Details */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Name</p>
                                    <p className="text-sm font-medium text-gray-900">{booking.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="text-sm font-medium text-gray-900">{booking.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="text-sm font-medium text-gray-900">{booking.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">PAN</p>
                                    <p className="text-sm font-medium text-gray-900">{booking.panNo}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Address</p>
                                    <p className="text-sm font-medium text-gray-900">{booking.address}, {booking.city}</p>
                                </div>
                            </div>
                        </div>

                        {/* Project & Unit */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project & Unit</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Project</p>
                                    <p className="text-sm font-medium text-gray-900">{booking.projectName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Category</p>
                                    <p className="text-sm font-medium text-gray-900">{booking.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Plot Number</p>
                                    <p className="text-sm font-medium text-gray-900">{booking.plotNo}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Sales Executive</p>
                                    <p className="text-sm font-medium text-gray-900">{booking.salesExecutive}</p>
                                </div>
                            </div>
                        </div>

                        {/* Commercials */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Commercials</h3>
                            <div className="grid grid-cols-4 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600">Unit Cost</p>
                                    <p className="text-lg font-bold text-gray-900">₹{booking.unitCost.toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Discount</p>
                                    <p className="text-lg font-bold text-green-600">-₹{booking.discount.toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Net Amount</p>
                                    <p className="text-lg font-bold text-brand-blue">₹{booking.netAmount.toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Balance</p>
                                    <p className="text-lg font-bold text-amber-600">₹{booking.balance.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'payments' && (
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Payment Schedule</h3>
                                <button
                                    onClick={() => showToast('info', 'Add payment form coming soon!')}
                                    className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors"
                                >
                                    Add Payment
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Milestone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Due Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Paid Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mode</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {payments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{payment.milestone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatDate(payment.dueDate)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">₹{payment.amount.toLocaleString('en-IN')}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-green-600">₹{payment.paidAmount.toLocaleString('en-IN')}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{payment.mode}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                            <button
                                onClick={() => showToast('info', 'Upload document form coming soon!')}
                                className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors"
                            >
                                Upload Document
                            </button>
                        </div>
                        <div className="space-y-3">
                            {documents.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-8 h-8 text-brand-blue" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                            <p className="text-xs text-gray-600">{doc.category} • {doc.size} • Uploaded by {doc.uploadedBy}</p>
                                        </div>
                                    </div>
                                    <button className="text-brand-blue hover:text-brand-blue-dark text-sm font-medium">
                                        Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'timeline' && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Timeline</h3>
                        <div className="space-y-4">
                            {timeline.map((entry, index) => (
                                <div key={entry.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${entry.type === 'created' ? 'bg-blue-100' :
                                                entry.type === 'status_change' ? 'bg-purple-100' :
                                                    entry.type === 'payment' ? 'bg-green-100' :
                                                        entry.type === 'document' ? 'bg-indigo-100' :
                                                            entry.type === 'cancelled' ? 'bg-red-100' : 'bg-gray-100'
                                            }`}>
                                            {entry.type === 'payment' ? <CreditCard className="w-4 h-4 text-green-600" /> :
                                                entry.type === 'document' ? <Upload className="w-4 h-4 text-indigo-600" /> :
                                                    entry.type === 'cancelled' ? <XCircle className="w-4 h-4 text-red-600" /> :
                                                        <CheckCircle className="w-4 h-4 text-purple-600" />}
                                        </div>
                                        {index < timeline.length - 1 && (
                                            <div className="w-0.5 h-12 bg-gray-200"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 pb-8">
                                        <p className="text-sm font-medium text-gray-900">{entry.description}</p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            {entry.createdBy} • {formatDate(entry.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default BookingDetail;
