import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FolderKanban,
    MapPin,
    Calendar,
    Package,
    Settings,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Leads', path: '/leads' },
    { icon: FolderKanban, label: 'Projects', path: '/projects' },
    { icon: MapPin, label: 'Site Visits', path: '/site-visits' },
    { icon: Calendar, label: 'Bookings', path: '/bookings' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: LayoutDashboard, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
    const location = useLocation();

    return (
        <aside
            className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                {!collapsed && (
                    <h2 className="text-xl font-bold text-gray-900">GAJRAJAH</h2>
                )}
                <button
                    onClick={onToggle}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    {collapsed ? (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-2 overflow-y-auto">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${isActive
                                        ? 'bg-brand-blue text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        } ${collapsed ? 'justify-center' : ''}`}
                                    title={collapsed ? item.label : ''}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {!collapsed && (
                                        <span className="font-medium">{item.label}</span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
