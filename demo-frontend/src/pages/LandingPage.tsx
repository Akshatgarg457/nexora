import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MessageSquare, BookOpen, Briefcase, BarChart3, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const workspaces = [
    {
      title: 'Meetings Workspace',
      desc: 'Schedule executive syncs, invite colleagues from the employee directory, and track structured agendas.',
      icon: Calendar,
      color: '#4f46e5'
    },
    {
      title: 'Communication Workspace',
      desc: 'Direct peer messaging, structured team conversations, and role-based communication histories.',
      icon: MessageSquare,
      color: '#0284c7'
    },
    {
      title: 'Study & Learning Workspace',
      desc: 'Enterprise learning resource catalog, AI video notes, and track individual learning progress.',
      icon: BookOpen,
      color: '#10b981'
    },
    {
      title: 'Project Management Workspace',
      desc: 'Agile milestone tracking, task assignment, status updates, and progress reports.',
      icon: Briefcase,
      color: '#8b5cf6'
    },
    {
      title: 'Data Analytics Workspace',
      desc: 'Executive KPI metrics, department breakdown charts, and real-time project velocity visualization.',
      icon: BarChart3,
      color: '#f59e0b'
    }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Header Bar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 4rem',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>N</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Nexora</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/login')} className="btn btn-secondary">Sign In</button>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            <span>Get Started</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '5rem 2rem 4rem 2rem',
        maxWidth: '1100px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#e0e7ff',
          color: '#3730a3',
          padding: '0.375rem 0.875rem',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}>
          <Cpu size={16} /> Spring Boot 3 + React Enterprise Integration Prototype
        </div>

        <h1 style={{
          fontSize: '3.25rem',
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          marginBottom: '1.5rem'
        }}>
          Nexora — Your Workspace, Your Way.
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: '#475569',
          maxWidth: '780px',
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6
        }}>
          A unified enterprise SaaS platform combining 5 essential workspaces, role-based security, MySQL persistence, and intelligent workspace assistant.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/login')} className="btn btn-primary btn-lg">
            <span>Launch Live Demo</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Workspaces Grid */}
      <section style={{ backgroundColor: '#f8fafc', padding: '4rem 2rem', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Five Workspaces. One Enterprise Platform.
            </h2>
            <p style={{ color: '#64748b' }}>Seamlessly connected through Spring Boot REST APIs and secure JWT authentication.</p>
          </div>

          <div className="grid-3">
            {workspaces.map((ws, idx) => {
              const Icon = ws.icon;
              return (
                <div key={idx} className="card" style={{ padding: '2rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: `${ws.color}15`,
                    color: ws.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                    {ws.title}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {ws.desc}
                  </p>
                </div>
              );
            })}

            <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>
                Spring Security & RBAC
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Stateless JWT authorization with fine-grained role checks (ADMIN, MANAGER, EMPLOYEE, INTERN).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>
        © 2026 Nexora Platform. Built with Spring Boot 3 & React TypeScript Integration Demo.
      </footer>
    </div>
  );
};
