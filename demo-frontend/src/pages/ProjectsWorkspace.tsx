import React, { useEffect, useState } from 'react';
import type { ProjectDto, TaskDto, EmployeeDto, TaskStatus, TaskPriority, ProgressReportDto } from '../types';
import { projectService, employeeService } from '../services/api';
import { Plus, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface ProjectsWorkspaceProps {
  currentUser: EmployeeDto | null;
}

export const ProjectsWorkspace: React.FC<ProjectsWorkspaceProps> = ({ currentUser }) => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Tab State: 'projects' | 'tasks'
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks'>('projects');

  // Modals
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectReports, setProjectReports] = useState<ProgressReportDto[]>([]);

  // Form Fields - Project
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pCat, setPCat] = useState('Engineering');
  const [pManager, setPManager] = useState<number>(currentUser?.id || 1);
  const [pStart, setPStart] = useState('');
  const [pEnd, setPEnd] = useState('');

  // Form Fields - Task
  const [tTitle, setTTitle] = useState('');
  const [tDesc, setTDesc] = useState('');
  const [tProjId, setTProjId] = useState<number>(0);
  const [tAssigneeId, setTAssigneeId] = useState<number>(currentUser?.id || 1);
  const [tPriority, setTPriority] = useState<TaskPriority>('MEDIUM');
  const [tDueDate, setTDueDate] = useState('');

  // Form Fields - Report
  const [rSummary, setRSummary] = useState('');
  const [rProgress, setRProgress] = useState(70);
  const [rBlockers, setRBlockers] = useState('');

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pList, tList, eList] = await Promise.all([
        projectService.getAll(),
        projectService.getTasks(),
        employeeService.getAll()
      ]);
      setProjects(pList);
      setTasks(tList);
      setEmployees(eList);
      if (pList.length > 0 && !tProjId) {
        setTProjId(pList[0].id);
      }
    } catch (err: any) {
      console.error('Projects load error:', err);
      setError('Failed to fetch projects and tasks from Spring Boot backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pStart || !pEnd) {
      setError('Please complete required fields for Project creation.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const created = await projectService.create({
        name: pName.trim(),
        description: pDesc.trim(),
        category: pCat,
        status: 'IN_PROGRESS',
        startDate: pStart,
        endDate: pEnd,
        managerId: pManager
      });

      setSuccessMsg(`Project "${created.name}" created and saved to MySQL!`);
      setShowProjectModal(false);
      // reset
      setPName('');
      setPDesc('');
      loadData();
    } catch (err: any) {
      console.error('Create project error:', err);
      setError(err.response?.data?.message || 'Failed to create project on server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTitle || !tProjId || !tAssigneeId || !tDueDate) {
      setError('Please fill in required Task fields.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const created = await projectService.createTask({
        projectId: tProjId,
        title: tTitle.trim(),
        description: tDesc.trim(),
        assigneeId: tAssigneeId,
        status: 'TODO',
        priority: tPriority,
        dueDate: tDueDate
      });

      setSuccessMsg(`Task "${created.title}" successfully assigned!`);
      setShowTaskModal(false);
      setTTitle('');
      setTDesc('');
      loadData();
    } catch (err: any) {
      console.error('Create task error:', err);
      setError('Failed to create task on server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTaskStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    try {
      await projectService.updateTaskStatus(taskId, newStatus);
      setSuccessMsg(`Task status updated to ${newStatus}`);
      loadData();
    } catch (err: any) {
      console.error('Update task status error:', err);
      setError('Failed to update task status on backend.');
    }
  };

  const openReportModal = async (projectId: number) => {
    setSelectedProjectId(projectId);
    try {
      const reports = await projectService.getReportsByProject(projectId);
      setProjectReports(reports);
    } catch (e) {
      console.warn('Could not fetch project reports:', e);
    }
    setShowReportModal(true);
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !currentUser || !rSummary) return;

    setSubmitting(true);
    try {
      await projectService.createReport({
        projectId: selectedProjectId,
        authorId: currentUser.id,
        summary: rSummary.trim(),
        progressPercentage: rProgress,
        blockers: rBlockers.trim()
      });

      setSuccessMsg('Progress report submitted successfully!');
      setShowReportModal(false);
      setRSummary('');
      setRBlockers('');
      loadData();
    } catch (err: any) {
      console.error('Create report error:', err);
      setError('Failed to submit progress report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Project Management Workspace</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Track company milestones, task lifecycles, and submit progress reports</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setShowProjectModal(true)} className="btn btn-secondary">
            <Plus size={16} /> New Project
          </button>
          <button onClick={() => setShowTaskModal(true)} className="btn btn-primary">
            <Plus size={16} /> Create Task
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('projects')}
          style={{
            padding: '0.75rem 1rem',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'projects' ? '2px solid #4f46e5' : 'none',
            color: activeTab === 'projects' ? '#4f46e5' : '#64748b',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          style={{
            padding: '0.75rem 1rem',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'tasks' ? '2px solid #4f46e5' : 'none',
            color: activeTab === 'tasks' ? '#4f46e5' : '#64748b',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          Task Board ({tasks.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          Loading projects and tasks from Spring Boot endpoints...
        </div>
      ) : activeTab === 'projects' ? (
        <div className="grid-2">
          {projects.map((p) => (
            <div key={p.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <span className="badge badge-primary">{p.category}</span>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>{p.name}</h3>
                </div>
                <span className="badge badge-success">{p.status}</span>
              </div>

              <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.5 }}>{p.description}</p>

              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
                Manager: <strong>{p.managerName}</strong> | Dates: {p.startDate} to {p.endDate}
              </div>

              <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                <div style={{ background: '#4f46e5', height: '100%', width: `${p.completionPercentage}%` }}></div>
              </div>
              <div style={{ fontSize: '0.75rem', textAlign: 'right', color: '#475569', marginBottom: '1rem' }}>
                {p.completionPercentage}% Progress
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button onClick={() => openReportModal(p.id)} className="btn btn-secondary btn-sm">
                  <FileText size={14} /> Progress Reports
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Tasks Table */
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Project</th>
                <th>Assignee</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{t.title}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.description}</div>
                  </td>
                  <td>{t.projectName}</td>
                  <td>{t.assigneeName}</td>
                  <td>
                    <span className={`badge ${t.priority === 'URGENT' || t.priority === 'HIGH' ? 'badge-danger' : 'badge-neutral'}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td>{t.dueDate}</td>
                  <td>
                    <span className={`badge ${t.status === 'DONE' ? 'badge-success' : t.status === 'IN_PROGRESS' ? 'badge-primary' : 'badge-warning'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={t.status}
                      onChange={(e) => handleTaskStatusChange(t.id, e.target.value as TaskStatus)}
                      className="form-select"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="REVIEW">REVIEW</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Project Modal */}
      {showProjectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label className="form-label">Project Name *</label>
                <input type="text" value={pName} onChange={(e) => setPName(e.target.value)} placeholder="AI Infrastructure" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea value={pDesc} onChange={(e) => setPDesc(e.target.value)} placeholder="Project goals..." className="form-textarea" rows={2} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input type="text" value={pCat} onChange={(e) => setPCat(e.target.value)} className="form-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input type="date" value={pStart} onChange={(e) => setPStart(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date *</label>
                  <input type="date" value={pEnd} onChange={(e) => setPEnd(e.target.value)} className="form-input" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Manager</label>
                <select value={pManager} onChange={(e) => setPManager(Number(e.target.value))} className="form-select">
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowProjectModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Create Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Project *</label>
                <select value={tProjId} onChange={(e) => setTProjId(Number(e.target.value))} className="form-select" required>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input type="text" value={tTitle} onChange={(e) => setTTitle(e.target.value)} placeholder="Setup API Security" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea value={tDesc} onChange={(e) => setTDesc(e.target.value)} className="form-textarea" rows={2} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Assignee *</label>
                  <select value={tAssigneeId} onChange={(e) => setTAssigneeId(Number(e.target.value))} className="form-select" required>
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select value={tPriority} onChange={(e) => setTPriority(e.target.value as TaskPriority)} className="form-select">
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date *</label>
                <input type="date" value={tDueDate} onChange={(e) => setTDueDate(e.target.value)} className="form-input" required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowTaskModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Assign Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Progress Report Modal */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Progress Reports</h2>

            {projectReports.length > 0 && (
              <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.75rem' }}>
                {projectReports.map(r => (
                  <div key={r.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>By {r.authorName} on {new Date(r.reportDate).toLocaleDateString()}</div>
                    <div style={{ fontSize: '0.875rem', color: '#0f172a' }}>{r.summary}</div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Progress: {r.progressPercentage}%</div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleCreateReport}>
              <div className="form-group">
                <label className="form-label">Report Summary *</label>
                <textarea value={rSummary} onChange={(e) => setRSummary(e.target.value)} placeholder="Milestone update..." className="form-textarea" rows={2} required />
              </div>
              <div className="form-group">
                <label className="form-label">Project Progress ({rProgress}%)</label>
                <input type="range" min="0" max="100" value={rProgress} onChange={(e) => setRProgress(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Blockers (if any)</label>
                <input type="text" value={rBlockers} onChange={(e) => setRBlockers(e.target.value)} placeholder="None" className="form-input" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowReportModal(false)} className="btn btn-secondary">Close</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
