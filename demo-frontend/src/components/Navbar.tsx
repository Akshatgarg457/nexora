import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { EmployeeDto } from '../types';
import { authService } from '../services/api';
import { LogOut, Bot, Shield, User } from 'lucide-react';

interface NavbarProps {
  currentUser: EmployeeDto | null;
  onToggleAi: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onToggleAi }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Nexora <span style={{ fontSize: '0.75rem', fontWeight: 500, background: '#e0e7ff', color: '#4f46e5', padding: '0.15rem 0.5rem', borderRadius: '4px', marginLeft: '0.5rem' }}>Integration Demo</span>
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {currentUser ? (
          <>
            <button
              onClick={onToggleAi}
              className="btn btn-secondary btn-sm"
              title="Toggle Nexora AI Assistant"
            >
              <Bot size={16} color="#4f46e5" />
              <span>AI Assistant</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              paddingLeft: '1rem',
              borderLeft: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}>
                {currentUser.avatar && currentUser.avatar !== 'NA' ? currentUser.avatar : currentUser.name.slice(0, 2).toUpperCase()}
              </div>

              <div style={{ lineHeight: '1.2' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  {currentUser.name}
                  {currentUser.role === 'ADMIN' && (
                    <span title="Administrator"><Shield size={14} color="#4f46e5" /></span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {currentUser.role} • {currentUser.department}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                style={{ marginLeft: '0.5rem' }}
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <button onClick={() => navigate('/login')} className="btn btn-primary btn-sm">
            <User size={16} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
