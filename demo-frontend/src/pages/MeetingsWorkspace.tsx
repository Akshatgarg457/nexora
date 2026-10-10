import React, { useEffect, useState } from 'react';
import type { MeetingDto, EmployeeDto } from '../types';
import { meetingService, employeeService } from '../services/api';
import { Calendar, Plus, Users, MapPin, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface MeetingsWorkspaceProps {
  currentUser: EmployeeDto | null;
}

export const MeetingsWorkspace: React.FC<MeetingsWorkspaceProps> = ({ currentUser }) => {
  const [meetings, setMeetings] = useState<MeetingDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
  const [agenda, setAgenda] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mList, eList] = await Promise.all([
        meetingService.getAll(),
        employeeService.getAll()
      ]);
      setMeetings(mList);
      setEmployees(eList);
    } catch (err: any) {
      console.error('Meetings load error:', err);
      setError('Failed to load meetings list from Spring Boot backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !location) {
      setError('Please fill in required meeting fields (Title, Date, Time, Location).');
      return;
    }

    if (!currentUser) {
      setError('You must be signed in to organize a meeting.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const created = await meetingService.create({
        title: title.trim(),
        description: description.trim(),
        date,
        time,
        location: location.trim(),
        organizerId: currentUser.id,
        participantIds: selectedParticipants,
        agenda: agenda.trim(),
        notes: notes.trim()
      });

      setSuccessMsg(`Meeting "${created.title}" successfully scheduled and saved to backend!`);
      setShowModal(false);
      // Reset form
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setLocation('');
      setSelectedParticipants([]);
      setAgenda('');
      setNotes('');
      // Reload meeting list
      loadData();
    } catch (err: any) {
      console.error('Create meeting error:', err);
      setError(err.response?.data?.message || 'Failed to create meeting on server.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleParticipant = (empId: number) => {
    if (selectedParticipants.includes(empId)) {
      setSelectedParticipants(selectedParticipants.filter(id => id !== empId));
    } else {
      setSelectedParticipants([...selectedParticipants, empId]);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Meeting Workspace</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Schedule executive syncs, invite staff members, and track structured meeting agendas</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} /> Schedule Meeting
        </button>
      </div>

      {successMsg && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={16} />
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
          Fetching scheduled meetings from Spring Boot endpoint (`GET /api/meetings`)...
        </div>
      ) : meetings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Calendar size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.125rem', color: '#0f172a' }}>No Meetings Scheduled</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>Click "Schedule Meeting" to create your first session.</p>
        </div>
      ) : (
        <div className="grid-2">
          {meetings.map((m) => (
            <div key={m.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '0.375rem' }}>{m.status || 'UPCOMING'}</span>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a' }}>{m.title}</h3>
                </div>
              </div>

              <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '1rem' }}>{m.description}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} color="#4f46e5" />
                  <span>{m.date} at {m.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="#0284c7" />
                  <span>{m.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={16} color="#10b981" />
                  <span>Organizer: <strong>{m.organizerName}</strong></span>
                </div>
              </div>

              {m.participantNames && m.participantNames.length > 0 && (
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                    Invited Participants ({m.participantNames.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {m.participantNames.map((name, i) => (
                      <span key={i} className="badge badge-neutral">{name}</span>
                    ))}
                  </div>
                </div>
              )}

              {m.agenda && (
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', marginTop: '0.75rem', fontSize: '0.8125rem' }}>
                  <strong>Agenda:</strong>
                  <div style={{ color: '#475569', whiteSpace: 'pre-line', marginTop: '0.25rem' }}>{m.agenda}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Schedule New Meeting
            </h2>

            <form onSubmit={handleCreateMeeting}>
              <div className="form-group">
                <label className="form-label">Meeting Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Sprint Review & Technical Demo"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief meeting objectives..."
                  className="form-textarea"
                  rows={2}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time *</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Room *</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Executive Room A / Zoom Link"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Invite Employee Directory</label>
                <div style={{ maxHeight: '120px', overflowY: 'auto', border: '1px solid #e2e8f0', padding: '0.5rem', borderRadius: '6px' }}>
                  {employees.map((emp) => (
                    <label key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '0.25rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(emp.id)}
                        onChange={() => toggleParticipant(emp.id)}
                      />
                      <span>{emp.name} ({emp.position} - {emp.department})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Agenda</label>
                <textarea
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  placeholder="1. Overview&#10;2. Architecture review..."
                  className="form-textarea"
                  rows={2}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving to Spring Boot...' : 'Create Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
