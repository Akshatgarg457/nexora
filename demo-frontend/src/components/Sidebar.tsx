import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  BookOpen,
  Briefcase,
  BarChart3,
  Users
} from 'lucide-react';
import type { EmployeeDto } from '../types';

interface SidebarProps {
  currentUser: EmployeeDto | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentUser }) => {
  const navItems = [
    { label: 'Overview Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Meetings Workspace', path: '/meetings', icon: Calendar },
    { label: 'Communication', path: '/communication', icon: MessageSquare },
    { label: 'Study & Learning', path: '/study', icon: BookOpen },
    { label: 'Project Management', path: '/projects', icon: Briefcase },
    { label: 'Data Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0
    }}>
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: '#4f46e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          color: '#ffffff',
          fontSize: '1rem'
        }}>
          N
        </div>
        <div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>Nexora</h1>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Corporate SaaS Platform</span>
        </div>
      </div>

      <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.75rem 0.5rem 0.75rem' }}>
          Workspaces
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? '#334155' : 'transparent',
                marginBottom: '0.25rem',
                transition: 'all 0.15s ease'
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {currentUser?.role === 'ADMIN' && (
          <>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '1.25rem 0.75rem 0.5rem 0.75rem' }}>
              Administration
            </div>
            <NavLink
              to="/admin/employees"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? '#334155' : 'transparent',
                transition: 'all 0.15s ease'
              })}
            >
              <Users size={18} />
              <span>Employee Directory</span>
            </NavLink>
          </>
        )}
      </nav>

      <div style={{
        padding: '1rem',
        borderTop: '1px solid #1e293b',
        backgroundColor: '#1e293b',
        fontSize: '0.75rem',
        color: '#94a3b8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 600, marginBottom: '0.25rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
          Spring Boot Connected
        </div>
        <div>API Port: 8080 | Demo UI: 5174</div>
      </div>
    </aside>
  );
};
