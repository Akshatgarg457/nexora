import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { API_BASE_URL, apiClient } from '../api/client';
import { Avatar } from '../components/ui/Avatar';
import {
  Settings,
  User,
  Server,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Shield,
  Layers,
  Cpu,
  Key,
  Database,
  ExternalLink,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser, resetDemoData } = useWorkspace();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [apiTestStatus, setApiTestStatus] = useState<'idle' | 'testing' | 'offline' | 'online'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const handleTestApi = async () => {
    setApiTestStatus('testing');
    try {
      await apiClient.get('/health', { timeout: 2500 });
      setApiTestStatus('online');
      setTestMessage('Successfully reached Spring Boot REST server on port 8080.');
    } catch {
      setApiTestStatus('offline');
      setTestMessage(
        `Spring Boot server unreachable at ${API_BASE_URL}. Graceful mock fallback active — all frontend features remain 100% operational.`
      );
    }
  };

  const handleReset = () => {
    resetDemoData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          Configuration & Environment
        </span>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Workspace Settings & Spring Boot Integration
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage user profiles, interface preferences, and backend REST coordination endpoints.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Demo state successfully restored to initial factory mock data!</span>
        </div>
      )}

      {/* User Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          Active Engineer Profile
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
          <Avatar name={currentUser.name} size="lg" className="rounded-2xl" />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900">{currentUser.name}</h4>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[11px]">
                {currentUser.role}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">
                {currentUser.team}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
          <div>
            <label className="text-slate-500 font-medium block mb-1">Display Name</label>
            <input
              type="text"
              readOnly
              value={currentUser.name}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-slate-500 font-medium block mb-1">Corporate Email</label>
            <input
              type="text"
              readOnly
              value={currentUser.email}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Spring Boot REST Backend Integration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-600" />
            Spring Boot REST Backend Integration
          </h3>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Client Layer Ready
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Nexora is architected with a decoupled HTTP client layer (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-700">src/api/client.ts</code>) ready to communicate with your Java Spring Boot microservice suite on port 8080.
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-slate-700 block">Target Base Endpoint:</span>
              <span className="font-mono text-indigo-600 font-medium">{API_BASE_URL}</span>
            </div>
            <button
              onClick={handleTestApi}
              disabled={apiTestStatus === 'testing'}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold self-start sm:self-auto transition-colors"
            >
              {apiTestStatus === 'testing' ? 'Testing Connection...' : 'Test Backend Ping'}
            </button>
          </div>

          {apiTestStatus !== 'idle' && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                apiTestStatus === 'online'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {apiTestStatus === 'online' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <span>{testMessage}</span>
            </div>
          )}
        </div>

        {/* API Contracts Directory */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-slate-700">Proposed Spring Boot REST Endpoints:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-600">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-emerald-700 font-bold">GET</span> /api/meetings
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-blue-700 font-bold">POST</span> /api/meetings/summary
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-emerald-700 font-bold">GET</span> /api/messages
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-blue-700 font-bold">POST</span> /api/messages/rewrite
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-emerald-700 font-bold">GET</span> /api/projects/tasks
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-blue-700 font-bold">POST</span> /api/assistant/chat
            </div>
          </div>
        </div>
      </div>

      {/* Reset State & Demo Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Restore Demo Environment</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Reset all modified meetings, inbox drafts, kanban tasks, and study topics back to initial defaults.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Mock Data</span>
        </button>
      </div>
    </div>
  );
};
