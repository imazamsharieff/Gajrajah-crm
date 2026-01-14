import React, { useState } from 'react';
import { X, Calendar, Clock, Car } from 'lucide-react';

interface ScheduleSiteVisitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSchedule: (visitData: SiteVisitData) => Promise<void>;
}

export interface SiteVisitData {
    visitDate: string;
    visitTime: string;
    visitMode: 'Cab' | 'Direct Visit' | 'Others';
    description: string;
}

const ScheduleSiteVisitModal: React.FC<ScheduleSiteVisitModalProps> = ({ isOpen, onClose, onSchedule }) => {
    const [formData, setFormData] = useState<SiteVisitData>({
        visitDate: '',
        visitTime: '',
        visitMode: 'Direct Visit',
        description: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.visitDate) {
            newErrors.visitDate = 'Visit date is required';
        }

        if (!formData.visitTime) {
            newErrors.visitTime = 'Visit time is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            await onSchedule(formData);
            // Reset form
            setFormData({
                visitDate: '',
                visitTime: '',
                visitMode: 'Direct Visit',
                description: '',
            });
            setErrors({});
            onClose();
        } catch (error) {
            console.error('Failed to schedule site visit:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Schedule Site Visit</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Visit Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Visit Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                value={formData.visitDate}
                                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                                min={today}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none ${errors.visitDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                        </div>
                        {errors.visitDate && <p className="text-red-500 text-sm mt-1">{errors.visitDate}</p>}
                    </div>

                    {/* Visit Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Visit Time <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="time"
                                value={formData.visitTime}
                                onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none ${errors.visitTime ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                        </div>
                        {errors.visitTime && <p className="text-red-500 text-sm mt-1">{errors.visitTime}</p>}
                    </div>

                    {/* Visit Mode */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Visit Mode <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={formData.visitMode}
                                onChange={(e) => setFormData({ ...formData, visitMode: e.target.value as SiteVisitData['visitMode'] })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none appearance-none"
                            >
                                <option value="Direct Visit">Direct Visit</option>
                                <option value="Cab">Cab</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description / Notes <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter visit details, location, or any special instructions..."
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Scheduling...' : 'Schedule Visit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleSiteVisitModal;
