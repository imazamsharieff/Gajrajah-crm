import React, { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AddUserModal from '../components/users/AddUserModal';
import { User, UserFormData, UserFilters } from '../types/users';
import { usersAPI } from '../services/usersService';
import { useToast } from '../components/common/Toast';

const Users: React.FC = () => {
    const { showToast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [filters, setFilters] = useState<UserFilters>({
        role: 'All',
        status: 'All',
        search: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [autoRefresh, setAutoRefresh] = useState(false);

    useEffect(() => {
        loadRoles();
    }, []);

    useEffect(() => {
        loadUsers();
    }, [filters, currentPage]);

    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                loadUsers();
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, filters, currentPage]);

    const loadRoles = async () => {
        try {
            const rolesData = await usersAPI.getRoles();
            setRoles(rolesData);
        } catch (error) {
            console.error('Failed to load roles:', error);
        }
    };

    const loadUsers = async () => {
        try {
            const response = await usersAPI.getUsers(filters, currentPage, 10);
            setUsers(response.users);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Failed to load users:', error);
            showToast('error', 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleSaveUser = async (data: UserFormData) => {
        try {
            if (selectedUser) {
                await usersAPI.updateUser(selectedUser.id, data);
                showToast('success', 'User updated successfully');
            } else {
                await usersAPI.createUser(data);
                showToast('success', 'User added successfully');
            }
            await loadUsers();
        } catch (error) {
            console.error('Failed to save user:', error);
            showToast('error', 'Failed to save user');
            throw error;
        }
    };

    const handleToggleStatus = async (user: User) => {
        try {
            const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
            await usersAPI.updateUserStatus(user.id, newStatus);
            showToast('success', `User ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`);
            await loadUsers();
        } catch (error) {
            console.error('Failed to update status:', error);
            showToast('error', 'Failed to update status');
        }
    };

    const handleDeleteUser = async (user: User) => {
        if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

        try {
            await usersAPI.deleteUser(user.id);
            showToast('success', 'User deleted successfully');
            await loadUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            showToast('error', 'Failed to delete user');
        }
    };

    const getRoleBadgeColor = (role: string) => {
        const colors: Record<string, string> = {
            'Manager': 'bg-purple-100 text-purple-800',
            'BDM': 'bg-blue-100 text-blue-800',
            'Sales': 'bg-green-100 text-green-800',
            'Pre-Sales': 'bg-yellow-100 text-yellow-800',
            'Executive': 'bg-indigo-100 text-indigo-800',
            'Telecaller': 'bg-pink-100 text-pink-800',
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600 mt-1">Manage team members and their roles</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${autoRefresh
                                    ? 'bg-brand-blue text-white border-brand-blue'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                            Auto Refresh
                        </button>
                        <button
                            onClick={handleAddUser}
                            className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add User
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Role Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                            </label>
                            <select
                                value={filters.role}
                                onChange={(e) => {
                                    setFilters({ ...filters, role: e.target.value });
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                            >
                                <option value="All">All Roles</option>
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) => {
                                    setFilters({ ...filters, status: e.target.value });
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Search */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Search
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => {
                                        setFilters({ ...filters, search: e.target.value });
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Search by name, email, phone..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                {loading ? (
                    <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Join Date
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-gray-600">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-gray-600">{user.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-gray-600">{user.department}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleToggleStatus(user)}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${user.status === 'Active'
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {user.status}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-gray-600">
                                                        {new Date(user.joinDate).toLocaleDateString('en-IN')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditUser(user)}
                                                            className="text-brand-blue hover:text-brand-blue-dark font-medium"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user)}
                                                            className="text-red-600 hover:text-red-800 font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Add/Edit User Modal */}
                <AddUserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveUser}
                    user={selectedUser}
                    roles={roles}
                />
            </div>
        </DashboardLayout>
    );
};

export default Users;
