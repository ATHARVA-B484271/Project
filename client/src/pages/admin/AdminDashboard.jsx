import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import API from '../../services/api';
import {
  FileText,
  Clock,
  Send,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAssignments: 0,
    totalSubmissions: 0,
    pendingCount: 0,
    needsChangesCount: 0,
    acceptedCount: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignRes, subRes] = await Promise.all([
        API.get('/assignments'),
        API.get('/submissions'),
      ]);

      const assignments = assignRes.data.assignments || [];
      const submissions = subRes.data.submissions || [];

      setStats({
        totalAssignments: assignments.length,
        totalSubmissions: subRes.data.stats?.totalSubmissions || submissions.length,
        pendingCount: subRes.data.stats?.pendingCount || 0,
        needsChangesCount: subRes.data.stats?.needsChangesCount || 0,
        acceptedCount: subRes.data.stats?.acceptedCount || 0,
      });

      setRecentSubmissions(submissions.slice(0, 8));
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopHeader title="Professor Control Center" />

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
                <div className="stat-number">{loading ? '...' : stats.pendingCount}</div>
                <div className="stat-label">Pending Reviews</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon rose">
                <AlertCircle />
              </div>
              <div>
                <div className="stat-number">{loading ? '...' : stats.needsChangesCount}</div>
                <div className="stat-label">Needs Changes</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon success">
                <CheckCircle2 />
              </div>
              <div>
                <div className="stat-number">{loading ? '...' : stats.acceptedCount}</div>
                <div className="stat-label">Accepted Submissions</div>
              </div>
            </div>
          </div>

          {/* Action Header & Recent Submissions Section */}
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
                Submission Reviews
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Review student coursework, assign marks, and provide written feedback.
              </p>
            </div>
            <Link to="/admin/assignments/create" className="btn btn-primary">
              <PlusCircle size={18} /> Create Assignment
            </Link>
          </div>

          {loading ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div className="skeleton" style={{ height: '28px', width: '70%', margin: '0 auto 1rem' }} />
              <div className="skeleton" style={{ height: '24px', width: '40%', margin: '0 auto' }} />
            </div>
          ) : recentSubmissions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
              <Send size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                No Submissions Received Yet
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Student submissions will appear here automatically for review.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Assignment</th>
                    <th>Version</th>
                    <th>Submitted</th>
                    <th>Timing</th>
                    <th>Review Status</th>
                    <th>Marks</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((sub) => (
                    <tr key={sub._id}>
                      <td>
                        <div style={{ fontWeight: '700', color: '#fff' }}>{sub.studentId?.name || 'N/A'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sub.studentId?.studentId}</div>
                      </td>
                      <td style={{ fontWeight: '600', color: '#fff' }}>
                        {sub.assignmentId?.title || 'N/A'}
                      </td>
                      <td>
                        <span style={{ fontWeight: '800', color: 'var(--primary-500)', fontFamily: 'monospace' }}>
                          v{sub.version || 1}
                        </span>
                      </td>
                      <td>{new Date(sub.submittedAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${sub.status === 'ON_TIME' ? 'badge-on-time' : 'badge-late'}`}>
                          {sub.status === 'ON_TIME' ? 'ON TIME' : 'LATE'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            sub.reviewStatus === 'ACCEPTED'
                              ? 'badge-review-accepted'
                              : sub.reviewStatus === 'NEEDS_CHANGES'
                              ? 'badge-review-needs-changes'
                              : 'badge-review-pending'
                          }`}
                        >
                          {sub.reviewStatus === 'ACCEPTED'
                            ? '✓ ACCEPTED'
                            : sub.reviewStatus === 'NEEDS_CHANGES'
                            ? 'NEEDS CHANGES'
                            : 'PENDING'}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: sub.marks !== null ? 'var(--accent-teal)' : 'var(--text-muted)' }}>
                          {sub.marks !== null ? `${sub.marks}/${sub.assignmentId?.maxMarks || 10}` : '-'}
                        </strong>
                      </td>
                      <td>
                        <Link
                          to={`/admin/submissions/${sub._id}/review`}
                          className="btn btn-secondary btn-sm"
                        >
                          <Edit3 size={14} /> Review
                        </Link>
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
