import React, { useEffect, useState } from 'react';
import type { EmployeeDto, Role } from '../types';
import { adminService } from '../services/api';
import { Plus, Shield, CheckCircle2, AlertCircle, UserCheck, UserX } from 'lucide-react';

export const AdminEmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal Form State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('EMPLOYEE');
  const [department, setDepartment] = useState('Engineering');
  const [position, setPosition] = useState('Software Engineer');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await adminService.getAllEmployees();
      setEmployees(list);
    } catch (err: any) {
      console.error('Admin employees load error:', err);
      setError(err.response?.data?.message || 'Access denied or failed to load admin employee directory.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !department || !position) {
      setError('Please fill in all required fields to create a new employee.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const created = await adminService.createEmployee({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        department: department.trim(),
        position: position.trim()
      });

      setSuccessMsg(`Employee account for "${created.name}" (${created.email}) created & saved to database!`);
      setShowModal(false);
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setRole('EMPLOYEE');
      loadEmployees();
    } catch (err: any) {
      console.error('Create employee error:', err);
      setError(err.response?.data?.message || 'Failed to create employee on server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (emp: EmployeeDto) => {
    const newStatus = !emp.active;
    try {
      await adminService.updateStatus(emp.id, newStatus);
      setSuccessMsg(`Employee "${emp.name}" status updated to ${newStatus ? 'Active' : 'Inactive'}`);
      loadEmployees();
    } catch (err: any) {
      console.error('Update status error:', err);
      setError('Failed to update employee active status on server.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={24} color="#4f46e5" /> Admin Employee Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Secured by `@PreAuthorize("hasRole('ADMIN')")`. Provision new user accounts and manage active directory permissions.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} /> Add Employee
        </button>
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
          Fetching employee directory from Spring Boot endpoint (`GET /api/admin/employees`)...
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>#{emp.id}</td>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{emp.name}</strong>
                  </td>
                  <td>{emp.email}</td>
                  <td>
                    <span className={`badge ${emp.role === 'ADMIN' ? 'badge-danger' : emp.role === 'MANAGER' ? 'badge-primary' : 'badge-neutral'}`}>
                      {emp.role}
                    </span>
                  </td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td>
                    <span className={`badge ${emp.active ? 'badge-success' : 'badge-danger'}`}>
                      {emp.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(emp)}
                      className={`btn btn-sm ${emp.active ? 'btn-danger' : 'btn-secondary'}`}
                      title={emp.active ? 'Deactivate user' : 'Activate user'}
                    >
                      {emp.active ? <UserX size={14} /> : <UserCheck size={14} />}
                      <span>{emp.active ? 'Deactivate' : 'Activate'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Employee Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Create New Employee Account
            </h2>

            <form onSubmit={handleCreateEmployee}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@nexora.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password123!"
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="form-select"
                    required
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="EMPLOYEE">EMPLOYEE</option>
                    <option value="INTERN">INTERN</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Job Position Title *</label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating Employee...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
