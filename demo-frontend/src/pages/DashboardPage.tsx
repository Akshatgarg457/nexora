import React, { useEffect, useState } from 'react';
import type { EmployeeDto, MeetingDto, ProjectDto, TaskDto, AnalyticsSummaryDto, LearningProgressDto } from '../types';
import { meetingService, projectService, analyticsService, studyService } from '../services/api';
import { Calendar, CheckCircle2, Clock, BookOpen, BarChart3, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardPageProps {
  currentUser: EmployeeDto | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser }) => {
  const [meetings, setMeetings] = useState<MeetingDto[]>([]);
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummaryDto | null>(null);
  const [progressList, setProgressList] = useState<LearningProgressDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [mRes, pRes, tRes, aRes] = await Promise.all([
          meetingService.getAll(),
          projectService.getAll(),
          projectService.getTasks(),
          analyticsService.getSummary(),
        ]);

        setMeetings(mRes);
        setProjects(pRes);
        setTasks(tRes);
        setAnalytics(aRes);

        if (currentUser) {
          try {
            const prog = await studyService.getProgress(currentUser.id);
            setProgressList(prog);
          } catch (e) {
            console.warn('Could not fetch user study progress:', e);
          }
        }
      } catch (err: any) {
        console.error('Dashboard Data Fetch Error:', err);
        setError('Failed to load real dashboard metrics from backend. Ensure backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
        Loading real-time executive dashboard from Spring Boot API...
      </div>
    );
  }

  return (
    <div>
      {/* Executive Welcome Banner */}
      <div style={{
        backgroundColor: '#0f172a',
        color: '#ffffff',
        borderRadius: '8px',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Welcome Back
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.25rem 0' }}>
            {currentUser?.name || 'Executive User'}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            {currentUser?.position} • {currentUser?.department} | Role: <span className="badge badge-primary">{currentUser?.role}</span>
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>API Status</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            ● Spring Boot REST Active
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Upcoming Meetings</span>
            <Calendar size={18} color="#4f46e5" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>
            {meetings.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Scheduled in directory</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Active Projects</span>
            <Clock size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>
            {projects.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Avg Progress: {analytics?.avgProjectCompletion || 0}%</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Total Tasks</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>
            {tasks.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>{analytics?.completedTasks || 0} completed</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Total Staff</span>
            <BarChart3 size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>
            {analytics?.totalEmployees || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Active employees</span>
        </div>
      </div>

      {/* Grid for Meetings and Projects */}
      <div className="grid-2">
        {/* Upcoming Meetings List */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Upcoming Meetings</h3>
            <Link to="/meetings" style={{ fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          {meetings.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>No upcoming meetings scheduled.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {meetings.slice(0, 3).map((m) => (
                <div key={m.id} style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#f8fafc' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{m.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    📅 {m.date} at {m.time} | 📍 {m.location}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#4f46e5', marginTop: '0.25rem' }}>
                    Organizer: {m.organizerName} ({m.participantNames.length} participants)
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Project Summary */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Active Projects</h3>
            <Link to="/projects" style={{ fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          {projects.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>No active projects recorded.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {projects.slice(0, 3).map((p) => (
                <div key={p.id} style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{p.name}</span>
                    <span className="badge badge-primary">{p.status}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    Manager: {p.managerName} | Category: {p.category}
                  </div>
                  <div style={{ background: '#e2e8f0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ background: '#4f46e5', height: '100%', width: `${p.completionPercentage}%` }}></div>
                  </div>
                  <div style={{ fontSize: '0.75rem', textAlign: 'right', color: '#64748b', marginTop: '0.25rem' }}>
                    {p.completionPercentage}% Completed
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Learning Progress Widget */}
      {progressList.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} color="#10b981" /> Your Study Progress
            </h3>
          </div>
          <div className="grid-2">
            {progressList.map((prog) => (
              <div key={prog.id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#ffffff' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{prog.resourceTitle}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0' }}>Status: {prog.status}</div>
                <div style={{ background: '#e2e8f0', height: '6px', borderRadius: '3px', margin: '0.5rem 0' }}>
                  <div style={{ background: '#10b981', height: '100%', width: `${prog.progressPercentage}%` }}></div>
                </div>
                {prog.aiSummary && (
                  <div style={{ fontSize: '0.75rem', color: '#047857', background: '#d1fae5', padding: '0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>
                    {prog.aiSummary}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
