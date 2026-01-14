import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import Projects from './pages/Projects';
import ProjectInventorySummary from './pages/ProjectInventorySummary';
import Inventory from './pages/Inventory';
import Bookings from './pages/Bookings';
import BookingDetail from './pages/BookingDetail';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import SiteVisits from './pages/SiteVisits';
import SiteVisitDetail from './pages/SiteVisitDetail';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/leads"
                        element={
                            <ProtectedRoute>
                                <Leads />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/leads/:id"
                        element={
                            <ProtectedRoute>
                                <LeadDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/projects"
                        element={
                            <ProtectedRoute>
                                <Projects />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/inventory"
                        element={
                            <ProtectedRoute>
                                <ProjectInventorySummary />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/inventory/:projectId"
                        element={
                            <ProtectedRoute>
                                <Inventory />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/bookings"
                        element={
                            <ProtectedRoute>
                                <Bookings />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/bookings/:id"
                        element={
                            <ProtectedRoute>
                                <BookingDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <Settings />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/reports"
                        element={
                            <ProtectedRoute>
                                <Reports />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/site-visits"
                        element={
                            <ProtectedRoute>
                                <SiteVisits />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/site-visits/:id"
                        element={
                            <ProtectedRoute>
                                <SiteVisitDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
