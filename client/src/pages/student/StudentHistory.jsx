import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Clock,
  History,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Award,
} from 'lucide-react';

const StudentHistory = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { showError } = useToast();

  const [assignment, setAssignment] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/submissions/assignment/${assignmentId}/history`);
        setAssignment(res.data.assignment);
        setHistory(res.data.history || []);
      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [assignmentId]);

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <TopHeader title="Submission History Timeline" />
          <div className="page-body">
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <div className="skeleton" style={{ height: '32px', width: '60%', margin: '0 auto 1rem' }} />
              <div className="skeleton" style={{ height: '120px', width: '80%', margin: '0 auto' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const maxMarks = assignment?.maxMarks || 10;

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopHeader title="Submission History Timeline" />

        <div className="page-body">
          <Link
            to="/student/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
            }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: '0.4rem' }}>
                {assignment?.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Complete chronological version history of your submitted work and professor evaluations.
              </p>
            </div>

            {history.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <History size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>No Submission Versions Logged</h3>
              </div>
            ) : (
              <div className="timeline">
                {history.map((ver) => (
                  <div key={ver._id} className="timeline-item">
                    <div className="timeline-dot">v{ver.version}</div>
                    <div className="card" style={{ padding: '1.75rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '1rem',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
                            Version {ver.version}
                          </span>
                          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
                            Submitted: {new Date(ver.submittedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <span className={`badge ${ver.status === 'ON_TIME' ? 'badge-on-time' : 'badge-late'}`}>
                            {ver.status === 'ON_TIME' ? 'ON TIME' : 'LATE'}
                          </span>

                          <span
                            className={`badge ${
                              ver.reviewStatus === 'ACCEPTED'
                                ? 'badge-review-accepted'
                                : ver.reviewStatus === 'NEEDS_CHANGES'
                                ? 'badge-review-needs-changes'
                                : 'badge-review-pending'
                            }`}
                          >
                            {ver.reviewStatus === 'ACCEPTED'
                              ? '✓ ACCEPTED'
                              : ver.reviewStatus === 'NEEDS_CHANGES'
                              ? 'NEEDS CHANGES'
                              : 'PENDING'}
                          </span>
                        </div>
                      </div>

                      {/* Marks Awarded Pill */}
                      {ver.marks !== null && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.4rem 0.85rem',
                            background: 'rgba(20, 184, 166, 0.15)',
                            border: '1px solid rgba(20, 184, 166, 0.3)',
                            borderRadius: 'var(--radius-md)',
                            color: '#2dd4bf',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            marginBottom: '1rem',
                          }}
                        >
                          <Award size={16} /> Marks Awarded: {ver.marks} / {maxMarks}
                        </div>
                      )}

                      {/* Professor Feedback */}
                      {ver.feedback && (
                        <div
                          style={{
                            padding: '1rem',
                            background: 'rgba(11, 15, 25, 0.8)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            marginBottom: '1rem',
                          }}
                        >
                          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-500)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                            <MessageSquare size={14} /> Professor Feedback:
                          </div>
                          <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                            "{ver.feedback}"
                          </div>
                        </div>
                      )}

                      {/* Submitted Answer snippet */}
                      {ver.response && (
                        <div style={{ marginBottom: '0.75rem' }}>
                          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                            Submitted Answer Content
                          </label>
                          <div
                            style={{
                              padding: '0.85rem',
                              background: 'rgba(15, 23, 42, 0.5)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.875rem',
                              color: 'var(--text-light)',
                              marginTop: '0.25rem',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {ver.response}
                          </div>
                        </div>
                      )}

                      {/* Submitted Link */}
                      {ver.submissionLink && (
                        <a
                          href={ver.submissionLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--accent-teal)', fontSize: '0.85rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}
                        >
                          Open Repository Link <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHistory;
