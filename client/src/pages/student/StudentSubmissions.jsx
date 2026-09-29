import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Send, CheckCircle2, AlertCircle, ExternalLink, FileText } from 'lucide-react';

const StudentSubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await API.get(`/submissions/student/${user.id || user._id}`);
        setSubmissions(res.data.submissions || []);
      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user]);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopHeader title="My Submissions" />

        <div className="page-body">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: '0.4rem' }}>
              Submission History
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Track all your submitted coursework, submission dates, and ON TIME vs LATE compliance.
            </p>
          </div>

          {loading ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div className="skeleton" style={{ height: '30px', width: '60%', margin: '0 auto 1rem' }} />
              <div className="skeleton" style={{ height: '20px', width: '40%', margin: '0 auto' }} />
            </div>
          ) : submissions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
              <Send size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                No Submissions Logged Yet
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                View active assignments and submit your solutions to see them listed here.
              </p>
              <Link to="/student/assignments" className="btn btn-primary">
                View Active Assignments
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Assignment Title</th>
                    <th>Deadline</th>
                    <th>Submitted At</th>
                    <th>Status</th>
                    <th>Submission Content</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub._id}>
                      <td style={{ fontWeight: '700', color: '#fff' }}>
                        {sub.assignmentId?.title || 'Assignment Deleted'}
                      </td>
                      <td>
                        {sub.assignmentId?.deadline
                          ? new Date(sub.assignmentId.deadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                          : 'N/A'}
                      </td>
                      <td>{new Date(sub.submittedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                      <td>
                        <span
                          className={`badge ${
                            sub.status === 'ON_TIME' ? 'badge-on-time' : 'badge-late'
                          }`}
                        >
                          {sub.status === 'ON_TIME' ? (
                            <>
                              <CheckCircle2 size={12} /> ON TIME
                            </>
                          ) : (
                            <>
                              <AlertCircle size={12} /> LATE
                            </>
                          )}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', maxWidth: '250px' }}>
                          {sub.response ? (
                            <span style={{ display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              <FileText size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                              {sub.response}
                            </span>
                          ) : null}
                          {sub.submissionLink ? (
                            <a
                              href={sub.submissionLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--accent-teal)', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}
                            >
                              View Link <ExternalLink size={12} />
                            </a>
                          ) : null}
                        </div>
                      </td>
                      <td>
                        <Link
                          to={`/student/assignments/${sub.assignmentId?._id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          View Details
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

export default StudentSubmissions;
