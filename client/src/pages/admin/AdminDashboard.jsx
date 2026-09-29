import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import API from '../../services/api';
import { FileText, Clock, Send, PlusCircle, Trash2, Eye } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAssignments: 0,
    activeAssignments: 0,
    totalSubmissions: 0,
  });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignRes, subRes] = await Promise.all([
        API.get('/assignments'),
        API.get('/submissions'),
      ]);

      const assignments = assignRes.data.assignments || [];
      const submissions = subRes.data.submissions || [];

      const activeCount = assignments.filter((a) => a.status === 'ACTIVE').length;

      setStats({
        totalAssignments: assignments.length,
        activeAssignments: activeCount,
        totalSubmissions: submissions.length,
      });

      setRecentAssignments(assignments.slice(0, 5));
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await API.delete(`/assignments/${id}`);
      showSuccess('Assignment deleted successfully.');
      fetchData();
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopHeader title="Admin Dashboard" />

        <div className="page-body">
          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon primary">
                <FileText />
              </div>
              <div>
                <div className="stat-number">{loading ? '...' : stats.totalAssignments}</div>
                <div className="stat-label">Total Assignments</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon warning">
                <Clock />
              </div>
              <div>
                <div className="stat-number">{loading ? '...' : stats.activeAssignments}</div>
                <div className="stat-label">Active Assignments</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon success">
                <Send />
              </div>
              <div>
                <div className="stat-number">{loading ? '...' : stats.totalSubmissions}</div>
                <div className="stat-label">Total Submissions</div>
              </div>
            </div>
          </div>

          {/* Quick Action Header & Recent Assignments */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>
                Recent Assignments
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Overview of your published course assignments
              </p>
            </div>
            <Link to="/admin/assignments/create" className="btn btn-primary">
              <PlusCircle size={18} /> Create Assignment
            </Link>
          </div>

          {loading ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div className="skeleton" style={{ height: '24px', width: '60%', margin: '0 auto 1rem' }} />
              <div className="skeleton" style={{ height: '24px', width: '40%', margin: '0 auto' }} />
            </div>
          ) : recentAssignments.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                No Assignments Created Yet
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Click below to create your first academic assignment for students.
              </p>
              <Link to="/admin/assignments/create" className="btn btn-primary">
                <PlusCircle size={18} /> Create Assignment
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Created</th>
                    <th>Deadline</th>
                    <th>Submissions</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssignments.map((assignment) => (
                    <tr key={assignment._id}>
                      <td style={{ fontWeight: '700', color: '#fff' }}>{assignment.title}</td>
                      <td>{new Date(assignment.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(assignment.deadline).toLocaleString()}</td>
                      <td>
                        <span style={{ fontWeight: '700', color: 'var(--accent-teal)' }}>
                          {assignment.submissionCount}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            assignment.status === 'ACTIVE' ? 'badge-active' : 'badge-closed'
                          }`}
                        >
                          {assignment.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link
                            to="/admin/submissions"
                            className="btn btn-secondary btn-sm"
                            title="View Submissions"
                          >
                            <Eye size={14} /> Submissions
                          </Link>
                          <button
                            onClick={() => handleDeleteAssignment(assignment._id)}
                            className="btn btn-danger btn-sm"
                            title="Delete Assignment"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
