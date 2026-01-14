import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Lead, LeadFormData, LeadStatus, LeadSource } from '../../types/leads';
import { getProjects, availableUsers } from '../../services/leadsService';
import { formatPhoneNumber, validatePhoneNumber, cleanPhoneNumber } from '../../utils/phoneFormatter';

interface LeadFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: LeadFormData) => Promise<void>;
    lead?: Lead | null;
}

const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose, onSave, lead }) => {
    const [formData, setFormData] = useState<LeadFormData>({
        name: '',
        phone: '',
        email: '',
        source: LeadSource.WEBSITE,
        status: LeadStatus.NEW,
        assignedTo: 'Admin',
        projectsInterested: [],
        notes: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<string[]>([]);

    // Load projects on mount
    useEffect(() => {
        const loadProjects = async () => {
            const projectsList = await getProjects();
            setProjects(projectsList);
        };
        loadProjects();
    }, []);

    useEffect(() => {
        if (lead) {
            setFormData({
                name: lead.name,
                phone: lead.phone,
                email: lead.email,
                source: lead.source,
                status: lead.status,
                assignedTo: lead.assignedTo,
                projectsInterested: lead.projectsInterested,
                notes: lead.notes,
            });
        } else {
            setFormData({
                name: '',
                phone: '',
                email: '',
                source: LeadSource.WEBSITE,
                status: LeadStatus.NEW,
                assignedTo: 'Admin',
                projectsInterested: [],
                notes: '',
            });
        }
        setErrors({});
    }, [lead, isOpen]);

    const handlePhoneChange = (value: string) => {
        const cleaned = cleanPhoneNumber(value);
        if (cleaned.length <= 10) {
            setFormData({ ...formData, phone: cleaned });
        }
    };

    const handleProjectToggle = (project: string) => {
        const current = formData.projectsInterested;
        if (current.includes(project)) {
            setFormData({ ...formData, projectsInterested: current.filter((p) => p !== project) });
        } else {
            setFormData({ ...formData, projectsInterested: [...current, project] });
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Lead name is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhoneNumber(formData.phone)) {
            newErrors.phone = 'Invalid phone number (must be 10 digits)';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Failed to save lead:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {lead ? 'Edit Lead' : 'Add New Lead'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Lead Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lead Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter lead name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="9876543210"
                        />
                        {formData.phone && validatePhoneNumber(formData.phone) && (
                            <p className="text-sm text-gray-500 mt-1">
                                Formatted: {formatPhoneNumber(formData.phone)}
                            </p>
                        )}
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="email@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Lead Source */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                        <select
                            value={formData.source}
                            onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                        >
                            {Object.values(LeadSource).map((source) => (
                                <option key={source} value={source}>
                                    {source}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Projects Interested */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Projects Interested
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {projects.length === 0 ? (
                                <p className="text-sm text-gray-500">Loading projects...</p>
                            ) : (
                                projects.map((project) => (
                                    <button
                                        key={project}
                                        type="button"
                                        onClick={() => handleProjectToggle(project)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${formData.projectsInterested.includes(project)
                                                ? 'bg-brand-blue text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {project}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Lead Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lead Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                        >
                            {Object.values(LeadStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Assigned To */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                        <select
                            value={formData.assignedTo}
                            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                        >
                            {availableUsers.map((user) => (
                                <option key={user} value={user}>
                                    {user}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none resize-none"
                            placeholder="Add any additional notes..."
                        />
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
                            {loading ? 'Saving...' : 'Save Lead'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadFormModal;
