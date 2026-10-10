import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { AssistantSlideOver } from './AssistantSlideOver';
import { AdaptiveIntentBar } from '../../features/adaptive/AdaptiveIntentBar';
import { AdaptationExplanationPanel } from '../../features/adaptive/AdaptationExplanationPanel';
import { useWorkspace } from '../../context/WorkspaceContext';

export const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isAdapting } = useWorkspace();

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-250 bg-[var(--canvas)] text-[var(--ink-primary)] selection:bg-indigo-500/20 selection:text-indigo-300">
      {/* Ambient background atmosphere */}
      <div className="fixed inset-0 pointer-events-none bg-grid-subtle ambient-glow z-0 opacity-70" />

      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Top Header */}
      <TopNav
        isCollapsed={isCollapsed}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 pt-16 relative z-10 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Universal Adaptive Intent Input & Feedback Banner */}
          <div className="space-y-4">
            <AdaptiveIntentBar />
            <AdaptationExplanationPanel />
          </div>

          {/* Dynamic Content View with subtle transition */}
          <div
            className={`transition-opacity duration-200 ${
              isAdapting ? 'opacity-40 pointer-events-none scale-[0.99]' : 'opacity-100 scale-100'
            }`}
          >
            <Outlet />
          </div>
        </div>
      </main>

      {/* Global Collapsible AI Assistant Drawer */}
      <AssistantSlideOver />
    </div>
  );
};
