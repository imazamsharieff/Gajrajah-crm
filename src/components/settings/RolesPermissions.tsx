import React, { useState, useEffect } from 'react';
import { useToast } from '../common/Toast';
import { settingsAPI } from '../../services/settingsService';
import type { Role } from '../../types/settings';

const RolesPermissions: React.FC = () => {
    const { showToast } = useToast();
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            const data = await settingsAPI.getRoles();
            setRoles(data);
            if (data.length > 0) setSelectedRole(data[0]);
        } catch (error) {
            showToast('error', 'Failed to load roles');
        } finally {
            setLoading(false);
        }
    };

    const modules = ['dashboard', 'leads', 'projects', 'inventory', 'bookings', 'siteVisits', 'payments', 'documents', 'settings'];
    const permissions = ['view', 'create', 'edit', 'delete', 'assign', 'export'];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Roles & Permissions</h2>
                <p className="text-gray-600 mt-1">Manage user roles and their permissions</p>
            </div>

            <div className="grid grid-cols-4 gap-6">
                {/* Roles List */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Roles</h3>
                    <div className="space-y-2">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRole(role)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedRole?.id === role.id ? 'bg-brand-blue text-white' : 'hover:bg-gray-100'
                                    }`}
                            >
                                {role.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Permissions Grid */}
                <div className="col-span-3 bg-white rounded-lg border border-gray-200 p-6">
                    {selectedRole && (
                        <>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{selectedRole.name}</h3>
                                <p className="text-sm text-gray-600">{selectedRole.description}</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Module</th>
                                            {permissions.map((perm) => (
                                                <th key={perm} className="text-center py-2 px-3 text-sm font-medium text-gray-700 capitalize">
                                                    {perm}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modules.map((module) => (
                                            <tr key={module} className="border-b">
                                                <td className="py-2 px-3 text-sm text-gray-900 capitalize">{module}</td>
                                                {permissions.map((perm) => (
                                                    <td key={perm} className="text-center py-2 px-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRole.permissions[module]?.[perm] || false}
                                                            onChange={() => showToast('info', 'Permission editing coming soon!')}
                                                            className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RolesPermissions;
