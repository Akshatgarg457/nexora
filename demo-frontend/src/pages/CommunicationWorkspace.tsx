import React, { useEffect, useState } from 'react';
import type { EmployeeDto, MessageDto } from '../types';
import { employeeService, messageService } from '../services/api';
import { Send, User, AlertCircle, MessageSquare } from 'lucide-react';

interface CommunicationWorkspaceProps {
  currentUser: EmployeeDto | null;
}

export const CommunicationWorkspace: React.FC<CommunicationWorkspaceProps> = ({ currentUser }) => {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<EmployeeDto | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchDirectory();
  }, []);

  const fetchDirectory = async () => {
    try {
      const list = await employeeService.getAll();
      // Filter out current user from directory list
      const peerList = list.filter(e => e.id !== currentUser?.id);
      setEmployees(peerList);
      if (peerList.length > 0) {
        selectPeer(peerList[0]);
      }
    } catch (err) {
      console.error('Failed to load employee directory:', err);
      setError('Failed to fetch employee directory from Spring Boot backend.');
    }
  };

  const selectPeer = async (peer: EmployeeDto) => {
    setSelectedUser(peer);
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    try {
      const chat = await messageService.getConversation(currentUser.id, peer.id);
      setMessages(chat);
    } catch (err: any) {
      console.error('Failed to load conversation:', err);
      setError(`Failed to fetch message history between user #${currentUser.id} and #${peer.id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !currentUser || !selectedUser || sending) return;

    setSending(true);
    setError(null);
    try {
      const sent = await messageService.send({
        senderId: currentUser.id,
        receiverId: selectedUser.id,
        content: newMsg.trim()
      });

      setMessages((prev) => [...prev, sent]);
      setNewMsg('');
    } catch (err: any) {
      console.error('Send message error:', err);
      setError('Failed to transmit message to backend API endpoint (`POST /api/messages`).');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Communication Workspace</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Direct peer messaging backed by Spring Boot REST controllers (`GET /api/messages/conversation` & `POST /api/messages`)
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1.5rem', height: '650px' }}>
        {/* Left Employee Directory */}
        <div className="card" style={{ width: '320px', padding: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: '#0f172a', background: '#f8fafc' }}>
            Company Directory ({employees.length})
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {employees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => selectPeer(emp)}
                style={{
                  padding: '0.875rem 1.25rem',
                  borderBottom: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  backgroundColor: selectedUser?.id === emp.id ? '#e0e7ff' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}>
                  {emp.avatar && emp.avatar !== 'NA' ? emp.avatar : emp.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{emp.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{emp.position} • {emp.department}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Conversation Window */}
        <div className="card" style={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column' }}>
          {selectedUser ? (
            <>
              {/* Active Header */}
              <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fafc'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <User size={20} color="#4f46e5" />
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>{selectedUser.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{selectedUser.position} ({selectedUser.department})</span>
                  </div>
                </div>
                <span className="badge badge-success">REST Active</span>
              </div>

              {/* Messages Area */}
              <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', color: '#64748b' }}>Loading conversation history...</div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '3rem' }}>
                    <MessageSquare size={36} color="#cbd5e1" style={{ marginBottom: '0.5rem' }} />
                    <div>No previous messages with {selectedUser.name}.</div>
                    <div style={{ fontSize: '0.75rem' }}>Send a message below to start the REST conversation.</div>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMine = m.senderId === currentUser?.id;
                    return (
                      <div
                        key={m.id}
                        style={{
                          alignSelf: isMine ? 'flex-end' : 'flex-start',
                          maxWidth: '70%',
                          backgroundColor: isMine ? '#4f46e5' : '#f1f5f9',
                          color: isMine ? '#ffffff' : '#0f172a',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          borderBottomRightRadius: isMine ? '2px' : '8px',
                          borderBottomLeftRadius: isMine ? '8px' : '2px',
                          fontSize: '0.875rem'
                        }}
                      >
                        <div>{m.content}</div>
                        <div style={{
                          fontSize: '0.6875rem',
                          color: isMine ? '#c7d2fe' : '#94a3b8',
                          marginTop: '0.25rem',
                          textAlign: 'right'
                        }}>
                          {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSend} style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder={`Type a message to ${selectedUser.name}...`}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary" disabled={sending || !newMsg.trim()}>
                  <Send size={16} />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              Select an employee from the directory to open conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
