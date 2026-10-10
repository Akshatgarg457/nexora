import React from 'react';
import { Navigate } from 'react-router-dom';
import type { EmployeeDto } from '../types';

interface ProtectedAdminRouteProps {
  currentUser: EmployeeDto | null;
  children: React.ReactNode;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ currentUser, children }) => {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'ADMIN') {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⛔</div>
        <h2 style={{ fontSize: '1.25rem', color: '#991b1b', marginBottom: '0.5rem' }}>403 Access Forbidden</h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Your current role (<strong>{currentUser.role}</strong>) does not have permission to access the Administrator Employee Management panel.
          Only users with role <code>ADMIN</code> are granted access by both the React Router guard and Spring Security <code>@PreAuthorize("hasRole('ADMIN')")</code> backend constraint.
        </p>
        <button onClick={() => window.history.back()} className="btn btn-secondary">
          Go Back
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
