import React from 'react';
import { Navigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Role } from '../types';

interface ProtectedAdminRouteProps {
  userRole?: Role;
  children: React.ReactNode;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ userRole, children }) => {
  if (userRole !== 'ADMIN') {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-3xl border border-rose-200 shadow-xl text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 text-[#9F1239] flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#111827] font-heading">ADMIN Authorization Required</h2>
        <p className="text-xs text-gray-600 leading-relaxed">
          Access to Employee Accounts & Role Management is restricted to Chief Administrators. Your current role is <strong className="text-[#9F1239]">{userRole || 'UNAUTHENTICATED'}</strong>.
        </p>
        <p className="text-[11px] text-gray-400">
          Tip: You can use the top bar Role Switcher in local dev mode to test ADMIN capabilities.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
