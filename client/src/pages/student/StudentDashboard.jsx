import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Eye,
  RefreshCw,
  History,
  Sparkles,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({
    activeAssignments: 0,
    accepted: 0,
    needsChanges: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [assignRes, subRes] = await Promise.all([
        API.get('/assignments'),
        API.get(`/submissions/student/${user.id || user._id}`),
      ]);

      const assignList = assignRes.data.assignments || [];
      const subList = subRes.data.submissions || [];

      const activeList = assignList.filter((a) => a.status === 'ACTIVE');
      const acceptedCount = subList.filter((s) => s.reviewStatus === 'ACCEPTED').length;
      const needsChangesCount = subList.filter((s) => s.reviewStatus === 'NEEDS_CHANGES').length;
      const pendingCount = subList.filter((s) => s.reviewStatus === 'PENDING').length;

      setStats({
        activeAssignments: activeList.length,
        accepted: acceptedCount,
        needsChanges: needsChangesCount,
        pending: pendingCount,
      });

      setAssignments(assignList);
      setSubmissions(subList);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopHeader title="Student Workspace" />

        <div className="page-body">
          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon primary">
                <BookOpen />
              </div>
              <div>
                <div className="stat-number">{loading ? '...' : stats.activeAssignments}</div>
                <div className="stat-label">Active Assignments</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon success">
                <CheckCircle2 />
              </div>
              <div>
                <div className="stat-number">{loading ? '...' : stats.accepted}</div>
                <div className="stat-label">Accepted Work</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon rose">
                <AlertCircle />
              </div>
              <div>
                <div className="stat-number">{loading ? '...' : stats.needsChanges}</div>
                <div className="stat-label">Needs Changes</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon warning">
                <Clock />
              </div>
              <div>
                <div className="stat-number">{loading ? '...' : stats.pending}</div>
                <div className="stat-label">Pending Review</div>
              </div>
            </div>
          </div>

          {/* Submissions Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginBottom: '0.4rem' }}>
              My Submissions & Review Status
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Track professor evaluation marks, written feedback, and submit updated versions when requested.
            </p>
          </div>

          {loading ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div className="skeleton" style={{ height: '28px', width: '70%', margin: '0 auto 1rem' }} />
              <div className="skeleton" style={{ height: '24px', width: '40%', margin: '0 auto' }} />
            </div>
          ) : submissions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
              <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                No Submissions Logged
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Select an active assignment below to submit your initial coursework.
              </p>
            </div>
          ) : (
            <div className="table-responsive" style={{ marginBottom: '3rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Latest Version</th>
                    <th>Marks</th>
                    <th>Review Status</th>
                    <th>Last Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub._id}>
                      <td style={{ fontWeight: '700', color: '#fff' }}>
                        {sub.assignmentId?.title || 'Assignment'}
                      </td>
                      <td>
                        <span style={{ fontWeight: '800', color: 'var(--primary-500)', fontFamily: 'monospace' }}>
                          v{sub.version || 1}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: sub.marks !== null ? 'var(--accent-teal)' : 'var(--text-muted)' }}>
                          {sub.marks !== null ? `${sub.marks}/${sub.assignmentId?.maxMarks || 10}` : '-'}
                        </strong>
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
                      <td>{new Date(sub.submittedAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <Link
                            to={`/student/submissions/${sub.assignmentId?._id}`}
                            className="btn btn-secondary btn-sm"
                          >
                            <Eye size={13} /> View Feedback
                          </Link>

                          {sub.reviewStatus === 'NEEDS_CHANGES' && (
                            <Link
                              to={`/student/submissions/${sub.assignmentId?._id}/update`}
                              className="btn btn-warning btn-sm"
                            >
                              <RefreshCw size={13} /> Submit Updated Version
                            </Link>
                          )}

                          <Link
                            to={`/student/submissions/${sub.assignmentId?._id}/history`}
                            className="btn btn-secondary btn-sm"
                          >
                            <History size={13} /> View History
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Available Assignments Cards Grid */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginBottom: '0.4rem' }}>
              Available Course Assignments
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="card"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span
                      className={`badge ${
                        assignment.status === 'ACTIVE' ? 'badge-active' : 'badge-closed'
                      }`}
                    >
                      {assignment.status}
                    </span>

                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', fontWeight: '700' }}>
                      Max Marks: {assignment.maxMarks || 10}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: '700',
                      color: '#fff',
                      marginBottom: '0.75rem',
                      lineHeight: '1.35',
                    }}
                  >
                    {assignment.title}
                  </h3>

                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.875rem',
                      marginBottom: '1.25rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {assignment.description}
                  </p>
                </div>

                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      color: 'var(--text-light)',
                      marginBottom: '1rem',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={14} color="var(--primary-500)" /> Deadline:
                    </span>
                    <strong style={{ color: '#fff' }}>
                      {new Date(assignment.deadline).toLocaleString([], {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </strong>
                  </div>

                  <Link
                    to={`/student/assignments/${assignment._id}`}
                    className="btn btn-primary btn-block"
                  >
                    View & Submit <Send size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
