import React, { useState, useEffect } from 'react';
import { Plus, Upload } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import LeadFilters from '../components/leads/LeadFilters';
import LeadTable from '../components/leads/LeadTable';
import LeadFormModal from '../components/leads/LeadFormModal';
import { Lead, LeadFilters as LeadFiltersType, LeadFormData } from '../types/leads';
import { leadsService } from '../services/leadsService';

const Leads: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
    const [filters, setFilters] = useState<LeadFiltersType>({
        search: '',
        status: 'all',
        source: 'all',
        assignedTo: 'all',
        dateFrom: null,
        dateTo: null,
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);

    // Load leads
    const loadLeads = async () => {
        try {
            const data = await leadsService.getLeads(filters);
            setFilteredLeads(data);
            if (filters.search === '' && filters.status === 'all' && filters.source === 'all' && filters.assignedTo === 'all') {
                setLeads(data);
            }
        } catch (error) {
            console.error('Failed to load leads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeads();
    }, [filters]);

    // Auto-refresh every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            loadLeads();
        }, 10000);

        return () => clearInterval(interval);
    }, [filters]);

    const handleSaveLead = async (data: LeadFormData) => {
        if (editingLead) {
            await leadsService.updateLead(editingLead.id, data);
        } else {
            await leadsService.createLead(data);
        }
        await loadLeads();
        setEditingLead(null);
    };

    const handleEditLead = (lead: Lead) => {
        setEditingLead(lead);
        setIsFormOpen(true);
    };

    const handleDeleteLead = async (id: string) => {
        await leadsService.deleteLead(id);
        await loadLeads();
    };

    const handleAddNew = () => {
        setEditingLead(null);
        setIsFormOpen(true);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
                        <p className="text-gray-600 mt-1">Manage and track your leads</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Import Leads
                        </button>
                        <button
                            onClick={handleAddNew}
                            className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Lead
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <LeadFilters filters={filters} onFilterChange={setFilters} />

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Total Leads</p>
                        <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Filtered Results</p>
                        <p className="text-2xl font-bold text-brand-blue">{filteredLeads.length}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">New This Week</p>
                        <p className="text-2xl font-bold text-green-600">
                            {leads.filter((l) => {
                                const weekAgo = new Date();
                                weekAgo.setDate(weekAgo.getDate() - 7);
                                return l.createdAt >= weekAgo;
                            }).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Follow-ups Due</p>
                        <p className="text-2xl font-bold text-orange-600">
                            {leads.filter((l) => l.status === 'Follow-Up').length}
                        </p>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading leads...</p>
                    </div>
                ) : (
                    <LeadTable
                        leads={filteredLeads}
                        onEdit={handleEditLead}
                        onDelete={handleDeleteLead}
                    />
                )}

                {/* Form Modal */}
                <LeadFormModal
                    isOpen={isFormOpen}
                    onClose={() => {
                        setIsFormOpen(false);
                        setEditingLead(null);
                    }}
                    onSave={handleSaveLead}
                    lead={editingLead}
                />
            </div>
        </DashboardLayout>
    );
};

export default Leads;
