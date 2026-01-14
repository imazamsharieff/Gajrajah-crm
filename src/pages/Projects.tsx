import React, { useState, useEffect } from 'react';
import { Plus, Upload } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import CategoryStats from '../components/projects/CategoryStats';
import ProjectFiltersComponent from '../components/projects/ProjectFilters';
import ProjectTable from '../components/projects/ProjectTable';
import ProjectFormDrawer from '../components/projects/ProjectFormDrawer';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useToast } from '../components/common/Toast';
import {
    Project,
    ProjectFilters,
    ProjectFormData,
    ProjectSummary,
    Manager,
} from '../types/projects';
import { projectsAPI } from '../services/projectsService';

const Projects: React.FC = () => {
    const { showToast } = useToast();
    const [projects, setProjects] = useState<Project[]>([]);
    const [summary, setSummary] = useState<ProjectSummary>({
        residentialCount: 0,
        industrialCount: 0,
        farmlandCount: 0,
    });
    const [filters, setFilters] = useState<ProjectFilters>({
        category: 'All',
        status: 'All',
        city: 'All',
        manager: 'All',
        search: '',
    });
    const [cities, setCities] = useState<string[]>([]);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [managerNames, setManagerNames] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; projectId: string | null }>({
        isOpen: false,
        projectId: null,
    });

    // Load initial data
    useEffect(() => {
        loadManagers();
        loadCities();
    }, []);

    // Load projects when filters/pagination/sorting changes
    useEffect(() => {
        loadProjects();
        loadSummary();
    }, [filters, currentPage, sortBy, sortOrder]);

    // Auto-refresh every 15 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            loadProjects();
            loadSummary();
        }, 15000);

        return () => clearInterval(interval);
    }, [filters, currentPage, sortBy, sortOrder]);

    const loadProjects = async () => {
        try {
            const response = await projectsAPI.getProjects(filters, currentPage, 10, sortBy, sortOrder);
            setProjects(response.projects);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Failed to load projects:', error);
            showToast('error', 'Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const loadSummary = async () => {
        try {
            const summaryData = await projectsAPI.getSummary();
            setSummary(summaryData);
        } catch (error) {
            console.error('Failed to load summary:', error);
        }
    };

    const loadManagers = async () => {
        try {
            const managersData = await projectsAPI.getManagers();
            setManagers(managersData);
            setManagerNames(managersData.map((m) => m.name));
        } catch (error) {
            console.error('Failed to load managers:', error);
        }
    };

    const loadCities = async () => {
        try {
            const citiesData = await projectsAPI.getCities();
            setCities(citiesData);
        } catch (error) {
            console.error('Failed to load cities:', error);
        }
    };

    const handleSaveProject = async (data: ProjectFormData) => {
        try {
            if (editingProject) {
                await projectsAPI.updateProject(editingProject.id, data);
                showToast('success', 'Project updated successfully');
            } else {
                await projectsAPI.createProject(data);
                showToast('success', 'Project created successfully');
            }
            await loadProjects();
            await loadSummary();
            setEditingProject(null);
        } catch (error) {
            console.error('Failed to save project:', error);
            showToast('error', 'Failed to save project');
            throw error;
        }
    };

    const handleEditProject = (project: Project) => {
        setEditingProject(project);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteConfirm({ isOpen: true, projectId: id });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm.projectId) return;

        try {
            await projectsAPI.deleteProject(deleteConfirm.projectId);
            showToast('success', 'Project deleted successfully');
            await loadProjects();
            await loadSummary();
        } catch (error) {
            console.error('Failed to delete project:', error);
            showToast('error', 'Failed to delete project');
        } finally {
            setDeleteConfirm({ isOpen: false, projectId: null });
        }
    };

    const handleAddNew = () => {
        setEditingProject(null);
        setIsFormOpen(true);
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                        <p className="text-gray-600 mt-1">Manage your real estate projects</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Import Projects
                        </button>
                        <button
                            onClick={handleAddNew}
                            className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Project
                        </button>
                    </div>
                </div>

                {/* Category Stats */}
                <CategoryStats summary={summary} />

                {/* Filters */}
                <ProjectFiltersComponent
                    filters={filters}
                    onFilterChange={setFilters}
                    cities={cities}
                    managers={managerNames}
                />

                {/* Table */}
                {loading ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading projects...</p>
                    </div>
                ) : (
                    <ProjectTable
                        projects={projects}
                        onEdit={handleEditProject}
                        onDelete={handleDeleteClick}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                    />
                )}

                {/* Form Drawer */}
                <ProjectFormDrawer
                    isOpen={isFormOpen}
                    onClose={() => {
                        setIsFormOpen(false);
                        setEditingProject(null);
                    }}
                    onSave={handleSaveProject}
                    project={editingProject}
                    managers={managers}
                />

                {/* Delete Confirmation */}
                <ConfirmDialog
                    isOpen={deleteConfirm.isOpen}
                    title="Delete Project"
                    message="Are you sure you want to delete this project? This action cannot be undone."
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteConfirm({ isOpen: false, projectId: null })}
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            </div>
        </DashboardLayout>
    );
};

export default Projects;
