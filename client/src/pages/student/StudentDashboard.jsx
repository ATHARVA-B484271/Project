import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import API from '../../services/api';
import { BookOpen, CheckCircle2, Clock, Send, Calendar } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const StudentDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({
    activeAssignments: 0,
    submitted: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/assignments');
      const assignList = res.data.assignments || [];

      const activeList = assignList.filter((a) => a.status === 'ACTIVE');
      const submittedCount = assignList.filter((a) => a.submissionStatus !== 'NOT_SUBMITTED').length;
      const pendingCount = assignList.filter((a) => a.submissionStatus === 'NOT_SUBMITTED').length;

      setStats({
        activeAssignments: activeList.length,
        submitted: submittedCount,
        pending: pendingCount,
      });

      setAssignments(assignList);
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
        <TopHeader title="Student Dashboard" />

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
                <div className="stat-number">{loading ? '...' : stats.submitted}</div>
                <div className="stat-label">Submitted</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon warning">
                <Clock />
              </div>
              <div>
                <div className="stat-number">{loading ? '...' : stats.pending}</div>
                <div className="stat-label">Pending Submissions</div>
              </div>
            </div>
          </div>

          {/* Main Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginBottom: '0.4rem' }}>
              Available Assignments
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Review assignments and submit your text response or link before the deadline.
            </p>
          </div>

          {loading ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div className="skeleton" style={{ height: '30px', width: '60%', margin: '0 auto 1rem' }} />
              <div className="skeleton" style={{ height: '20px', width: '40%', margin: '0 auto' }} />
            </div>
          ) : assignments.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
              <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                No Assignments Available
              </h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Your professors have not published any assignments yet.
              </p>
            </div>
          ) : (
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

                      {/* Submission Status Badge */}
                      {assignment.submissionStatus === 'ON_TIME' && (
                        <span className="badge badge-on-time">Submitted: ON TIME</span>
                      )}
                      {assignment.submissionStatus === 'LATE' && (
                        <span className="badge badge-late">Submitted: LATE</span>
                      )}
                      {assignment.submissionStatus === 'NOT_SUBMITTED' && (
                        <span className="badge badge-not-submitted">NOT SUBMITTED</span>
                      )}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
