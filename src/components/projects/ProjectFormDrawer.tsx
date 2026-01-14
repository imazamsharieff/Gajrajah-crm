import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
    Project,
    ProjectFormData,
    ProjectCategory,
    ProjectStatus,
    Manager,
} from '../../types/projects';

interface ProjectFormDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ProjectFormData) => Promise<void>;
    project?: Project | null;
    managers: Manager[];
}

const ProjectFormDrawer: React.FC<ProjectFormDrawerProps> = ({
    isOpen,
    onClose,
    onSave,
    project,
    managers,
}) => {
    const [formData, setFormData] = useState<ProjectFormData>({
        name: '',
        category: ProjectCategory.RESIDENTIAL,
        description: '',
        reraStatus: false,
        reraNo: '',
        address: '',
        city: '',
        state: 'Karnataka',
        landmark: '',
        mapsUrl: '',
        totalUnits: 0,
        availableUnits: 0,
        smartInventory: false,
        status: ProjectStatus.ACTIVE,
        assignedManager: '',
        tags: [],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name,
                category: project.category,
                description: project.description,
                reraStatus: project.reraStatus,
                reraNo: project.reraNo,
                address: project.address,
                city: project.city,
                state: project.state,
                landmark: project.landmark,
                mapsUrl: project.mapsUrl,
                totalUnits: project.totalUnits,
                availableUnits: project.availableUnits,
                smartInventory: project.smartInventory,
                status: project.status,
                assignedManager: project.assignedManager,
                tags: project.tags,
            });
        } else {
            setFormData({
                name: '',
                category: ProjectCategory.RESIDENTIAL,
                description: '',
                reraStatus: false,
                reraNo: '',
                address: '',
                city: '',
                state: 'Karnataka',
                landmark: '',
                mapsUrl: '',
                totalUnits: 0,
                availableUnits: 0,
                smartInventory: false,
                status: ProjectStatus.ACTIVE,
                assignedManager: managers[0]?.name || '',
                tags: [],
            });
        }
        setErrors({});
    }, [project, isOpen, managers]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Project name is required';
        }
        if (formData.reraStatus && !formData.reraNo.trim()) {
            newErrors.reraNo = 'RERA number is required when RERA status is Yes';
        }
        if (formData.totalUnits < 0) {
            newErrors.totalUnits = 'Total units must be a positive number';
        }
        if (formData.availableUnits < 0) {
            newErrors.availableUnits = 'Available units must be a positive number';
        }
        if (formData.availableUnits > formData.totalUnits) {
            newErrors.availableUnits = 'Available units cannot exceed total units';
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
            console.error('Failed to save project:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end z-50">
            <div className="bg-white w-full max-w-2xl h-full overflow-y-auto slide-in-right">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {project ? 'Edit Project' : 'Add New Project'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Project Details Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                        <div className="space-y-4">
                            {/* Project Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Project Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter project name"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value as ProjectCategory })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                >
                                    {Object.values(ProjectCategory).map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none resize-none"
                                    placeholder="Enter project description"
                                />
                            </div>

                            {/* RERA Status */}
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.reraStatus}
                                        onChange={(e) =>
                                            setFormData({ ...formData, reraStatus: e.target.checked, reraNo: '' })
                                        }
                                        className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
                                    />
                                    <span className="text-sm font-medium text-gray-700">RERA Registered</span>
                                </label>
                            </div>

                            {/* RERA No */}
                            {formData.reraStatus && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        RERA Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.reraNo}
                                        onChange={(e) => setFormData({ ...formData, reraNo: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none ${errors.reraNo ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter RERA number"
                                    />
                                    {errors.reraNo && <p className="text-red-500 text-sm mt-1">{errors.reraNo}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Location Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                        <div className="space-y-4">
                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                    placeholder="Enter address"
                                />
                            </div>

                            {/* City and State */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                        placeholder="Enter city"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <input
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                        placeholder="Enter state"
                                    />
                                </div>
                            </div>

                            {/* Landmark */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                                <input
                                    type="text"
                                    value={formData.landmark}
                                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                    placeholder="Enter landmark"
                                />
                            </div>

                            {/* Google Maps URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Google Maps URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.mapsUrl}
                                    onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                    placeholder="https://maps.google.com/..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Inventory Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Summary</h3>
                        <div className="space-y-4">
                            {/* Total and Available Units */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Units
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.totalUnits}
                                        onChange={(e) =>
                                            setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 0 })
                                        }
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none ${errors.totalUnits ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        min="0"
                                    />
                                    {errors.totalUnits && (
                                        <p className="text-red-500 text-sm mt-1">{errors.totalUnits}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Available Units
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.availableUnits}
                                        onChange={(e) =>
                                            setFormData({ ...formData, availableUnits: parseInt(e.target.value) || 0 })
                                        }
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none ${errors.availableUnits ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        min="0"
                                    />
                                    {errors.availableUnits && (
                                        <p className="text-red-500 text-sm mt-1">{errors.availableUnits}</p>
                                    )}
                                </div>
                            </div>

                            {/* Smart Inventory */}
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.smartInventory}
                                        onChange={(e) =>
                                            setFormData({ ...formData, smartInventory: e.target.checked })
                                        }
                                        className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Enable Smart Inventory Module
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Management Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Management</h3>
                        <div className="space-y-4">
                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({ ...formData, status: e.target.value as ProjectStatus })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                >
                                    {Object.values(ProjectStatus).map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Assigned Manager */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Assigned Manager
                                </label>
                                <select
                                    value={formData.assignedManager}
                                    onChange={(e) => setFormData({ ...formData, assignedManager: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                >
                                    {managers.map((manager) => (
                                        <option key={manager.id} value={manager.name}>
                                            {manager.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddTag();
                                            }
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                        placeholder="Add a tag and press Enter"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-brand-blue text-white text-sm rounded-full flex items-center gap-2"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
                            {loading ? 'Saving...' : 'Save Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectFormDrawer;
