import React, { useEffect, useState } from 'react';
import type { LearningResourceDto, LearningProgressDto, EmployeeDto } from '../types';
import { studyService } from '../services/api';
import { Clock, PlayCircle, CheckCircle2, AlertCircle, FileText, Sparkles } from 'lucide-react';

interface StudyWorkspaceProps {
  currentUser: EmployeeDto | null;
}

export const StudyWorkspace: React.FC<StudyWorkspaceProps> = ({ currentUser }) => {
  const [resources, setResources] = useState<LearningResourceDto[]>([]);
  const [userProgress, setUserProgress] = useState<LearningProgressDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<LearningResourceDto | null>(null);

  // Update progress modal state
  const [progressModal, setProgressModal] = useState(false);
  const [percentage, setPercentage] = useState(50);
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadStudyData();
  }, [currentUser]);

  const loadStudyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const resList = await studyService.getResources();
      setResources(resList);

      if (currentUser) {
        const progList = await studyService.getProgress(currentUser.id);
        setUserProgress(progList);
      }
    } catch (err: any) {
      console.error('Failed to load study workspace data:', err);
      setError('Failed to fetch learning resources from Spring Boot endpoint (`GET /api/study/resources`).');
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (res: LearningResourceDto) => {
    setSelectedResource(res);
    const existing = userProgress.find(p => p.resourceId === res.id);
    if (existing) {
      setPercentage(existing.progressPercentage);
      setNotes(existing.videoNotes || '');
    } else {
      setPercentage(25);
      setNotes('');
    }
    setProgressModal(true);
  };

  const handleUpdateProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedResource) return;

    setUpdating(true);
    setError(null);
    setSuccessMsg(null);

    const status = percentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS';

    try {
      await studyService.updateProgress({
        employeeId: currentUser.id,
        resourceId: selectedResource.id,
        status,
        progressPercentage: percentage,
        videoNotes: notes.trim()
      });

      setSuccessMsg(`Learning progress updated for "${selectedResource.title}"!`);
      setProgressModal(false);
      loadStudyData();
    } catch (err: any) {
      console.error('Update progress error:', err);
      setError('Failed to update progress on Spring Boot backend.');
    } finally {
      setUpdating(false);
    }
  };

  const getProgressForResource = (resId: number) => {
    return userProgress.find(p => p.resourceId === resId);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Study & Learning Workspace</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Explore enterprise technical learning modules, update progress, and review AI video summaries
        </p>
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          Fetching catalog from Spring Boot endpoint (`GET /api/study/resources`)...
        </div>
      ) : (
        <div className="grid-3">
          {resources.map((res) => {
            const prog = getProgressForResource(res.id);
            return (
              <div key={res.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">{res.category}</span>
                  <span className="badge badge-neutral">{res.level}</span>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                  {res.title}
                </h3>

                <p style={{ color: '#64748b', fontSize: '0.875rem', flex: 1, marginBottom: '1rem', lineHeight: 1.5 }}>
                  {res.description}
                </p>

                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Clock size={14} /> Est. Duration: <strong>{res.estimatedTime}</strong>
                </div>

                {prog && (
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                      <span>Your Progress</span>
                      <span>{prog.progressPercentage}% ({prog.status})</span>
                    </div>
                    <div style={{ background: '#e2e8f0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ background: '#10b981', height: '100%', width: `${prog.progressPercentage}%` }}></div>
                    </div>
                    {prog.aiSummary && (
                      <div style={{ fontSize: '0.75rem', color: '#065f46', marginTop: '0.5rem', display: 'flex', gap: '0.25rem' }}>
                        <Sparkles size={12} color="#047857" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{prog.aiSummary}</span>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button onClick={() => setSelectedResource(res)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    <FileText size={14} /> View Syllabus
                  </button>
                  <button onClick={() => openUpdateModal(res)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    <PlayCircle size={14} /> Update Progress
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resource Details Modal */}
      {selectedResource && !progressModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-primary">{selectedResource.category}</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
                  {selectedResource.title}
                </h2>
              </div>
            </div>

            <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {selectedResource.description}
            </p>

            <div className="card" style={{ background: '#f8fafc', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Sparkles size={14} color="#4f46e5" /> Sample Course Transcript & AI Summary
              </div>
              <p style={{ fontSize: '0.875rem', color: '#0f172a', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {selectedResource.sampleTranscript || 'Transcript available during module streaming.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setSelectedResource(null)} className="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Update Modal */}
      {progressModal && selectedResource && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Update Progress: {selectedResource.title}
            </h2>

            <form onSubmit={handleUpdateProgress}>
              <div className="form-group">
                <label className="form-label">Completion Percentage ({percentage}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Personal Study Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes on key concepts..."
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setProgressModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={updating}>
                  {updating ? 'Saving...' : 'Save Progress'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
