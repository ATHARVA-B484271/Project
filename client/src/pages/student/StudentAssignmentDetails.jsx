import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FileText,
  Link2,
} from 'lucide-react';

const StudentAssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [response, setResponse] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/assignments/${id}`);
      setAssignment(res.data.assignment);
      if (res.data.submission) {
        setSubmission(res.data.submission);
        setResponse(res.data.submission.response || '');
        setSubmissionLink(res.data.submission.submissionLink || '');
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!response.trim() && !submissionLink.trim()) {
      showError('Please provide either a text response or a submission link.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post('/submissions', {
        assignmentId: id,
        response: response.trim(),
        submissionLink: submissionLink.trim(),
      });

      const updatedSub = res.data.submission;
      setSubmission(updatedSub);

      if (updatedSub.status === 'ON_TIME') {
        showSuccess('Assignment submitted ON TIME!');
      } else {
        showInfo('Assignment submitted LATE (after deadline).');
      }

      fetchDetails();
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
          <TopHeader title="Assignment Details" />
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

  if (!assignment) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <TopHeader title="Assignment Details" />
          <div className="page-body">
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <h3>Assignment Not Found</h3>
              <Link to="/student/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopHeader title="Assignment Details" />

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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column: Assignment Details */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span className={`badge ${assignment.status === 'ACTIVE' ? 'badge-active' : 'badge-closed'}`}>
                  {assignment.status}
                </span>

                {submission ? (
                  <span className={`badge ${submission.status === 'ON_TIME' ? 'badge-on-time' : 'badge-late'}`}>
                    {submission.status === 'ON_TIME' ? 'SUBMITTED: ON TIME' : 'SUBMITTED: LATE'}
                  </span>
                ) : (
                  <span className="badge badge-not-submitted">NOT SUBMITTED</span>
                )}
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff', marginBottom: '1rem' }}>
                {assignment.title}
              </h2>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={15} /> Created: {new Date(assignment.createdAt).toLocaleDateString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fff', fontWeight: '700' }}>
                  <Clock size={15} color="var(--primary-500)" /> Deadline: {new Date(assignment.deadline).toLocaleString()}
                </span>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--text-light)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '700' }}>
                  Instructions & Description
                </h4>
                <div
                  style={{
                    color: 'var(--text-main)',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    background: 'rgba(15, 23, 42, 0.5)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {assignment.description}
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Posted by: <strong>{assignment.createdBy?.name || 'Professor'}</strong> ({assignment.createdBy?.department || 'CSE'})
              </div>
            </div>

            {/* Right Column: Submission Form */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', marginBottom: '0.5rem' }}>
                Submit Your Work
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                You can provide a text response, a submission link (GitHub/Google Drive), or both.
              </p>

              {submission && (
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    background: submission.status === 'ON_TIME' ? 'rgba(20, 184, 166, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    border: submission.status === 'ON_TIME' ? '1px solid rgba(20, 184, 166, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  {submission.status === 'ON_TIME' ? (
                    <CheckCircle2 size={24} color="#2dd4bf" />
                  ) : (
                    <AlertCircle size={24} color="#fca5a5" />
                  )}
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                      Submitted {submission.status === 'ON_TIME' ? 'ON TIME' : 'LATE'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      Timestamp: {new Date(submission.submittedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileText size={16} /> Option 1: Answer / Text Response
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={5}
                    placeholder="Type or paste your text answer, report summary, or code explanation..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Link2 size={16} /> Option 2: Submission Link (GitHub / Drive URL)
                  </label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://github.com/username/project-repo"
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.35rem', display: 'block' }}>
                    Must be a valid URL starting with http:// or https://
                  </small>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={submitting}
                  style={{ marginTop: '1.5rem' }}
                >
                  <Send size={18} /> {submitting ? 'Submitting Work...' : submission ? 'Update Submission' : 'Submit Assignment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAssignmentDetails;
