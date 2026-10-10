import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { EmployeeDto } from './types';
import { authService } from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AiDrawer } from './components/AiDrawer';
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
import './styles/index.css';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<EmployeeDto | null>(() => {
    const saved = localStorage.getItem('nexora_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAiOpen, setIsAiOpen] = useState(false);

  useEffect(() => {
    // Attempt to refresh profile if token exists
    const token = localStorage.getItem('nexora_token');
    if (token && !currentUser) {
      authService.getCurrentUser()
        .then((user) => {
          setCurrentUser(user);
          localStorage.setItem('nexora_user', JSON.stringify(user));
        })
        .catch((err) => {
          console.warn('Session verification failed:', err);
          authService.logout();
        });
    }
  }, []);

  const handleLoginSuccess = (user: EmployeeDto) => {
    setCurrentUser(user);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing & Auth Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

        {/* Protected Application Routes Layout */}
        <Route
          path="/*"
          element={
            currentUser ? (
              <div className="app-container">
                <Sidebar currentUser={currentUser} />
                <div className="main-content">
                  <Navbar currentUser={currentUser} onToggleAi={() => setIsAiOpen(!isAiOpen)} />
                  <main className="page-body">
                    <Routes>
                      <Route path="/dashboard" element={<DashboardPage currentUser={currentUser} />} />
                      <Route path="/meetings" element={<MeetingsWorkspace currentUser={currentUser} />} />
                      <Route path="/communication" element={<CommunicationWorkspace currentUser={currentUser} />} />
                      <Route path="/study" element={<StudyWorkspace currentUser={currentUser} />} />
                      <Route path="/projects" element={<ProjectsWorkspace currentUser={currentUser} />} />
                      <Route path="/analytics" element={<AnalyticsWorkspace />} />
                      <Route
                        path="/admin/employees"
                        element={
                          <ProtectedAdminRoute currentUser={currentUser}>
                            <AdminEmployeesPage />
                          </ProtectedAdminRoute>
                        }
                      />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
                <AiDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} currentUser={currentUser} />
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
