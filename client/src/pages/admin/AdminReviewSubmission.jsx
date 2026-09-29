import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import Modal from '../../components/Modal';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Clock,
  Calendar,
  ExternalLink,
  FileText,
  CheckCircle2,
  AlertCircle,
  History,
  Send,
  Sparkles,
  Award,
} from 'lucide-react';

const AdminReviewSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [submission, setSubmission] = useState(null);
  const [totalVersions, setTotalVersions] = useState(1);
  const [history, setHistory] = useState([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [marks, setMarks] = useState('');
  const [reviewStatus, setReviewStatus] = useState('ACCEPTED');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSubmissionDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/submissions/${id}`);
      const sub = res.data.submission;
      setSubmission(sub);
      setTotalVersions(res.data.totalVersions || 1);

      if (sub.marks !== null) setMarks(sub.marks.toString());
      if (sub.reviewStatus && sub.reviewStatus !== 'PENDING') setReviewStatus(sub.reviewStatus);
      if (sub.feedback) setFeedback(sub.feedback);

      // Fetch version history for this student + assignment
      const historyRes = await API.get(
        `/submissions/assignment/${sub.assignmentId._id}/history?studentId=${sub.studentId._id}`
      );
      setHistory(historyRes.data.history || []);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissionDetails();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const maxMarks = submission?.assignmentId?.maxMarks || 10;
    const numericMarks = Number(marks);

    if (marks === '' || isNaN(numericMarks) || numericMarks < 0 || numericMarks > maxMarks) {
      showError(`Please enter a valid mark between 0 and ${maxMarks}.`);
      return;
    }

    if (!reviewStatus) {
      showError('Please select a Review Status (ACCEPTED or NEEDS CHANGES).');
      return;
    }

    try {
      setSubmitting(true);
      await API.put(`/submissions/${id}/review`, {
        marks: numericMarks,
        status: reviewStatus,
        feedback: feedback.trim(),
      });

      showSuccess('Submission reviewed successfully.');
      navigate('/admin/dashboard');
    } catch (err) {
      showError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <TopHeader title="Review Submission" />
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

  if (!submission) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <TopHeader title="Review Submission" />
          <div className="page-body">
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <h3>Submission Not Found</h3>
              <Link to="/admin/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const maxMarks = submission.assignmentId?.maxMarks || 10;

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopHeader title="Review Student Submission" />

        <div className="page-body">
          <Link
            to="/admin/dashboard"
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

          {/* Desktop Two-Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* LEFT COLUMN: Student Submission Info */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary-500)', background: 'rgba(99, 102, 241, 0.15)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
                  VERSION {submission.version || 1}
                </span>

                <span className={`badge ${submission.status === 'ON_TIME' ? 'badge-on-time' : 'badge-late'}`}>
                  {submission.status === 'ON_TIME' ? 'ON TIME' : 'LATE'}
                </span>
              </div>

              {/* Student Header */}
              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(11, 15, 25, 0.7)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1.5rem',
                }}
              >
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                  {submission.studentId?.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Roll/ID: <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{submission.studentId?.studentId}</strong> | {submission.studentId?.email}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                  Department: {submission.studentId?.department} ({submission.studentId?.academicYear})
                </p>
              </div>

              {/* Assignment Title & Timestamps */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                  Assignment Title
                </label>
                <h4 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: '700', marginTop: '0.25rem' }}>
                  {submission.assignmentId?.title}
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                    Original Deadline
                  </label>
                  <p style={{ color: '#fff', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                    {new Date(submission.assignmentId?.deadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                    Submitted At
                  </label>
                  <p style={{ color: '#fff', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                    {new Date(submission.submittedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              {/* Text Response */}
              {submission.response ? (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                    Student Answer / Response
                  </label>
                  <div
                    style={{
                      padding: '1.25rem',
                      background: 'rgba(11, 15, 25, 0.9)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      fontSize: '0.925rem',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {submission.response}
                  </div>
                </div>
              ) : null}

              {/* Submission Link */}
              {submission.submissionLink ? (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                    Project Repository Link
                  </label>
                  <a
                    href={submission.submissionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-block"
                  >
                    Open Submission Link <ExternalLink size={16} />
                  </a>
                </div>
              ) : null}

              {/* Previous Versions Button */}
              {history.length > 1 && (
                <div
                  style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Total Versions Submitted: <strong style={{ color: '#fff' }}>{history.length}</strong>
                  </span>
                  <button
                    onClick={() => setIsHistoryModalOpen(true)}
                    className="btn btn-secondary btn-sm"
                  >
                    <History size={14} /> View Version History
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Review Panel Form */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Award size={22} color="var(--primary-500)" />
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff' }}>
                  Professor Review Panel
                </h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
                Grade Version {submission.version || 1} and specify whether to Accept or request Changes.
              </p>

              <form onSubmit={handleReviewSubmit}>
                {/* Marks input */}
                <div className="form-group">
                  <label className="form-label">
                    Marks Awarded (Max: {maxMarks}) *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="number"
                      min="0"
                      max={maxMarks}
                      step="0.5"
                      className="form-input"
                      placeholder={`0 - ${maxMarks}`}
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                      style={{ fontSize: '1.2rem', fontWeight: '700', width: '140px' }}
                      required
                    />
                    <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                      / {maxMarks}
                    </span>
                  </div>
                </div>

                {/* Review Status Radio Selection */}
                <div className="form-group">
                  <label className="form-label">Review Decision / Status *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setReviewStatus('ACCEPTED')}
                      className={`btn ${reviewStatus === 'ACCEPTED' ? 'btn-success' : 'btn-secondary'}`}
                      style={{ padding: '0.85rem', fontWeight: '700' }}
                    >
                      <CheckCircle2 size={18} /> Accept Work
                    </button>

                    <button
                      type="button"
                      onClick={() => setReviewStatus('NEEDS_CHANGES')}
                      className={`btn ${reviewStatus === 'NEEDS_CHANGES' ? 'btn-warning' : 'btn-secondary'}`}
                      style={{ padding: '0.85rem', fontWeight: '700' }}
                    >
                      <AlertCircle size={18} /> Request Changes
                    </button>
                  </div>
                </div>

                {/* Feedback Textarea */}
                <div className="form-group">
                  <label className="form-label">Written Feedback & Guidance</label>
                  <textarea
                    className="form-textarea"
                    rows={5}
                    placeholder="Provide constructive feedback, corrections required, or praise..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={submitting}
                  style={{ marginTop: '1.5rem', padding: '0.9rem' }}
                >
                  <Send size={18} /> {submitting ? 'Saving Review...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>

          {/* Submission Version History Modal */}
          <Modal
            isOpen={isHistoryModalOpen}
            onClose={() => setIsHistoryModalOpen(false)}
            title="Version History"
          >
            <div className="timeline">
              {history.map((ver) => (
                <div key={ver._id} className="timeline-item">
                  <div className="timeline-dot">v{ver.version}</div>
                  <div
                    style={{
                      background: 'rgba(11, 15, 25, 0.7)',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Submitted: {new Date(ver.submittedAt).toLocaleString()}
                      </span>
                      <span className={`badge ${ver.status === 'ON_TIME' ? 'badge-on-time' : 'badge-late'}`}>
                        {ver.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span
                        className={`badge ${
                          ver.reviewStatus === 'ACCEPTED'
                            ? 'badge-review-accepted'
                            : ver.reviewStatus === 'NEEDS_CHANGES'
                            ? 'badge-review-needs-changes'
                            : 'badge-review-pending'
                        }`}
                      >
                        {ver.reviewStatus}
                      </span>

                      {ver.marks !== null && (
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-teal)' }}>
                          Marks: {ver.marks}/{maxMarks}
                        </span>
                      )}
                    </div>

                    {ver.response && (
                      <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {ver.response}
                      </p>
                    )}

                    {ver.feedback && (
                      <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        <strong>Feedback:</strong> {ver.feedback}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewSubmission;
