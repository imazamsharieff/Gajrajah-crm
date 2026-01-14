import React, { useState } from 'react';
import { User, Users, Shield, Zap, Link2, Bell, Palette, FileText, CreditCard, Settings as SettingsIcon } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import MyProfile from '../components/settings/MyProfile';
import UserManagement from '../components/settings/UserManagement';
import RolesPermissions from '../components/settings/RolesPermissions';
import Automation from '../components/settings/Automation';
import Integrations from '../components/settings/Integrations';
import Notifications from '../components/settings/Notifications';
import Branding from '../components/settings/Branding';
import AuditLogs from '../components/settings/AuditLogs';
import Billing from '../components/settings/Billing';
import SystemDefaults from '../components/settings/SystemDefaults';

type SettingsSection =
    | 'profile'
    | 'users'
    | 'roles'
    | 'automation'
    | 'integrations'
    | 'notifications'
    | 'branding'
    | 'audit'
    | 'billing'
    | 'defaults';

const Settings: React.FC = () => {
    const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

    const menuItems = [
        { id: 'profile' as SettingsSection, label: 'My Profile', icon: User },
        { id: 'users' as SettingsSection, label: 'User Management', icon: Users },
        { id: 'roles' as SettingsSection, label: 'Roles & Permissions', icon: Shield },
        { id: 'automation' as SettingsSection, label: 'Custom Rules & Automation', icon: Zap },
        { id: 'integrations' as SettingsSection, label: 'API & Integrations', icon: Link2 },
        { id: 'notifications' as SettingsSection, label: 'Notifications & Communication', icon: Bell },
        { id: 'branding' as SettingsSection, label: 'Branding & UI Preferences', icon: Palette },
        { id: 'audit' as SettingsSection, label: 'Audit Logs', icon: FileText },
        { id: 'billing' as SettingsSection, label: 'Billing', icon: CreditCard },
        { id: 'defaults' as SettingsSection, label: 'System Defaults', icon: SettingsIcon },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return <MyProfile />;
            case 'users':
                return <UserManagement />;
            case 'roles':
                return <RolesPermissions />;
            case 'automation':
                return <Automation />;
            case 'integrations':
                return <Integrations />;
            case 'notifications':
                return <Notifications />;
            case 'branding':
                return <Branding />;
            case 'audit':
                return <AuditLogs />;
            case 'billing':
                return <Billing />;
            case 'defaults':
                return <SystemDefaults />;
            default:
                return <MyProfile />;
        }
    };

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
                {/* Left Navigation */}
                <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
                        <p className="text-sm text-gray-600">Manage your CRM configuration</p>
                    </div>
                    <nav className="px-3 pb-6">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${activeSection === item.id
                                            ? 'bg-brand-blue text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Right Content Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="p-8">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
