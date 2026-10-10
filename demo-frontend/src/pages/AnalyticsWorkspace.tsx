import React, { useEffect, useState } from 'react';
import type { AnalyticsSummaryDto } from '../types';
import { analyticsService } from '../services/api';
import { BarChart3, Users, Calendar, CheckCircle, AlertCircle, Database } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const AnalyticsWorkspace: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getSummary();
      setSummary(data);
    } catch (err: any) {
      console.error('Analytics load error:', err);
      setError('Failed to fetch analytics summary from Spring Boot endpoint (`GET /api/analytics/summary`).');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const deptData = summary?.departmentCountMap
    ? Object.entries(summary.departmentCountMap).map(([name, value]) => ({ name, count: value }))
    : [];

  const statusData = summary?.projectStatusMap
    ? Object.entries(summary.projectStatusMap).map(([name, value]) => ({ name, count: value }))
    : [];

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Data Analytics Workspace</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Executive KPI metrics and real-time database summary dashboard</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#d1fae5', color: '#065f46', padding: '0.375rem 0.75rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
          <Database size={16} /> Backend MySQL / H2 Query Live
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          Calculating aggregate metrics from backend database...
        </div>
      ) : summary ? (
        <>
          {/* KPI Metrics */}
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Active Employees</span>
                <Users size={18} color="#4f46e5" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>{summary.totalEmployees}</div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Persisted in DB</span>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Scheduled Meetings</span>
                <Calendar size={18} color="#0284c7" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>{summary.activeMeetings}</div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Live sessions</span>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Active Projects</span>
                <BarChart3 size={18} color="#10b981" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>{summary.activeProjects}</div>
              <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Avg {summary.avgProjectCompletion}% complete</span>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Tasks Completed</span>
                <CheckCircle size={18} color="#8b5cf6" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>{summary.completedTasks}</div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{summary.pendingTasks} pending tasks</span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid-2">
            {/* Department Breakdown BarChart */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Employee Distribution by Department</h3>
              </div>
              {deptData.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>No department data available.</p>
              ) : (
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Project Status PieChart */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Projects Status Breakdown</h3>
              </div>
              {statusData.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>No project status data available.</p>
              ) : (
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry: any) => `${entry.name}: ${entry.value ?? entry.count}`}
                      >
                        {statusData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
