import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  History,
  RefreshCw,
  Award,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

const StudentFeedback = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { showError } = useToast();

  const [assignment, setAssignment] = useState(null);
  const [latestSubmission, setLatestSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/submissions/assignment/${assignmentId}/history`);
        setAssignment(res.data.assignment);
        setLatestSubmission(res.data.latestVersion);
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
          <TopHeader title="Professor Feedback" />
          <div className="page-body">
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <div className="skeleton" style={{ height: '32px', width: '50%', margin: '0 auto 1rem' }} />
              <div className="skeleton" style={{ height: '100px', width: '80%', margin: '0 auto' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!latestSubmission) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <TopHeader title="Professor Feedback" />
          <div className="page-body">
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <h3>No Submissions Found</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                You have not submitted work for this assignment yet.
              </p>
              <Link to={`/student/assignments/${assignmentId}`} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                Submit Work Now
              </Link>
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
        <TopHeader title="Professor Feedback & Review" />

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

          <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
            {/* Header badges */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary-500)', background: 'rgba(99, 102, 241, 0.15)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)' }}>
                LATEST VERSION: v{latestSubmission.version || 1}
              </span>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className={`badge ${latestSubmission.status === 'ON_TIME' ? 'badge-on-time' : 'badge-late'}`}>
                  {latestSubmission.status === 'ON_TIME' ? 'ON TIME' : 'LATE'}
                </span>

                <span
                  className={`badge ${
                    latestSubmission.reviewStatus === 'ACCEPTED'
                      ? 'badge-review-accepted'
                      : latestSubmission.reviewStatus === 'NEEDS_CHANGES'
                      ? 'badge-review-needs-changes'
                      : 'badge-review-pending'
                  }`}
                >
                  {latestSubmission.reviewStatus === 'ACCEPTED'
                    ? '✓ ACCEPTED'
                    : latestSubmission.reviewStatus === 'NEEDS_CHANGES'
                    ? 'NEEDS CHANGES'
                    : 'PENDING REVIEW'}
                </span>
              </div>
            </div>

            {/* Assignment Title */}
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff', marginBottom: '1.5rem' }}>
              {assignment?.title}
            </h2>

            {/* Marks Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                background: 'linear-gradient(135deg, rgba(21, 29, 48, 0.9), rgba(30, 41, 66, 0.9))',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                marginBottom: '2rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Award size={28} color="var(--accent-teal)" />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                    Marks Awarded
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
                    {latestSubmission.marks !== null ? `${latestSubmission.marks} / ${maxMarks}` : 'Not Graded Yet'}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Submitted: <strong style={{ color: '#fff' }}>{new Date(latestSubmission.submittedAt).toLocaleString()}</strong>
              </div>
            </div>

            {/* Professor Feedback Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--text-light)', fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <MessageSquare size={18} color="var(--primary-500)" /> Professor Feedback & Comments
              </h4>
              <div
                style={{
                  padding: '1.25rem',
                  background: 'rgba(11, 15, 25, 0.8)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  color: latestSubmission.feedback ? 'var(--text-main)' : 'var(--text-muted)',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  fontStyle: latestSubmission.feedback ? 'normal' : 'italic',
                }}
              >
                {latestSubmission.feedback || 'Your professor has not added written feedback for this version yet.'}
              </div>
            </div>

            {/* Submitted Response Details */}
            <div style={{ marginBottom: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Your Submitted Answer (Version {latestSubmission.version})
              </h4>
              {latestSubmission.response && (
                <div
                  style={{
                    padding: '1rem',
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.9rem',
                    whiteSpace: 'pre-wrap',
                    marginBottom: '1rem',
                  }}
                >
                  {latestSubmission.response}
                </div>
              )}
              {latestSubmission.submissionLink && (
                <a
                  href={latestSubmission.submissionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-teal)', fontSize: '0.9rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  Open Submission Repository Link <ExternalLink size={14} />
                </a>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {latestSubmission.reviewStatus === 'NEEDS_CHANGES' ? (
                <Link
                  to={`/student/submissions/${assignmentId}/update`}
                  className="btn btn-warning"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <RefreshCw size={18} /> Submit Updated Version (v{(latestSubmission.version || 1) + 1})
                </Link>
              ) : latestSubmission.reviewStatus === 'ACCEPTED' ? (
                <div
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    color: '#34d399',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <CheckCircle2 size={18} /> Assignment Accepted — No Further Updates Required
                </div>
              ) : null}

              <Link
                to={`/student/submissions/${assignmentId}/history`}
                className="btn btn-secondary"
              >
                <History size={18} /> View Submission History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeedback;
