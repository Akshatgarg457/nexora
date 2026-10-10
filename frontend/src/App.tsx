import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MeetingsWorkspace } from './pages/MeetingsWorkspace';
import { CommunicationWorkspace } from './pages/CommunicationWorkspace';
import { StudyWorkspace } from './pages/StudyWorkspace';
import { ProjectsWorkspace } from './pages/ProjectsWorkspace';
import { AnalyticsWorkspace } from './pages/AnalyticsWorkspace';
import { AdminEmployeesPage } from './pages/AdminEmployeesPage';

import { AuthResponse, Role } from './types';
import { authApi } from './services/api';

export const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    return localStorage.getItem('nexora_theme') || 'indigo';
  });

  const [currentUser, setCurrentUser] = useState<AuthResponse | null>(() => {
    const saved = localStorage.getItem('nexora_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      accessToken: 'demo-token',
      tokenType: 'Bearer',
      expiresIn: 86400000,
      id: 1,
      name: 'Nexora System Admin',
      email: 'admin@nexora.com',
      role: 'ADMIN',
      department: 'Executive Office',
      position: 'Chief Technology Administrator',
      avatar: 'NA'
    };
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('nexora_theme', currentTheme);
  }, [currentTheme]);

  const handleLoginSuccess = (user: AuthResponse) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
  };

  const handleRoleSwitch = (newRole: Role) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role: newRole };
    setCurrentUser(updated);
    localStorage.setItem('nexora_user', JSON.stringify(updated));
  };

  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

        {/* Application Workspace Layout */}
        <Route
          path="/app"
          element={
            <div className="flex min-h-screen bg-slate-50">
              <Sidebar userRole={currentUser?.role} />
              <div className="flex-1 flex flex-col min-w-0">
                <Navbar
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onRoleSwitch={handleRoleSwitch}
                  currentTheme={currentTheme}
                  onThemeChange={setCurrentTheme}
                />
                <main className="flex-1 overflow-y-auto">
                  <Outlet />
                </main>
              </div>
              <AiAssistantDrawer currentEmployeeId={currentUser?.id} />
            </div>
          }
        >
          <Route index element={<DashboardPage employeeId={currentUser?.id} />} />
          <Route path="meetings" element={<MeetingsWorkspace currentUserId={currentUser?.id} />} />
          <Route path="communication" element={<CommunicationWorkspace currentUserId={currentUser?.id} />} />
          <Route path="study" element={<StudyWorkspace currentUserId={currentUser?.id} />} />
          <Route path="projects" element={<ProjectsWorkspace currentUserId={currentUser?.id} userRole={currentUser?.role} />} />
          <Route path="analytics" element={<AnalyticsWorkspace />} />
          
          {/* Admin Protected Route */}
          <Route
            path="admin/employees"
            element={
              <ProtectedAdminRoute userRole={currentUser?.role}>
                <AdminEmployeesPage />
              </ProtectedAdminRoute>
            }
          />
        </Route>

        {/* Fallback Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
