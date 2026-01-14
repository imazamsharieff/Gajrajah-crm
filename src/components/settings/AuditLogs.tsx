import React, { useState, useEffect } from 'react';
import { settingsAPI } from '../../services/settingsService';
import type { AuditLog } from '../../types/settings';

const AuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            const response = await settingsAPI.getAuditLogs();
            setLogs(response.data);
        } catch (error) {
            console.error('Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString('en-IN');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
                <p className="text-gray-600 mt-1">View system activity and changes</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Timestamp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Module</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Changes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(log.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.action}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.module}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {log.oldValue && log.newValue && (
                                            <span>{log.oldValue} → {log.newValue}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
