import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  RefreshCw,
  Send,
  MessageSquare,
  FileText,
  Link2,
} from 'lucide-react';

const StudentResubmit = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();

  const [assignment, setAssignment] = useState(null);
  const [latestSubmission, setLatestSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form fields for new version
  const [response, setResponse] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/submissions/assignment/${assignmentId}/history`);
        setAssignment(res.data.assignment);
        const latest = res.data.latestVersion;
        setLatestSubmission(latest);

        if (latest) {
          if (latest.reviewStatus === 'ACCEPTED') {
            showInfo('This assignment has already been ACCEPTED. No further versions allowed.');
            navigate(`/student/submissions/${assignmentId}`);
            return;
          }
          // Pre-populate response / link for quick editing
          setResponse(latest.response || '');
          setSubmissionLink(latest.submissionLink || '');
        }
      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!response.trim() && !submissionLink.trim()) {
      showError('Please provide either a text response or a submission link for your updated version.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post(`/submissions/${assignmentId}/versions`, {
        response: response.trim(),
        submissionLink: submissionLink.trim(),
      });

      const updatedSub = res.data.submission;
      showSuccess(`Version ${updatedSub.version} submitted successfully!`);
      navigate(`/student/submissions/${assignmentId}/history`);
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
          <TopHeader title="Submit Updated Version" />
          <div className="page-body">
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <div className="skeleton" style={{ height: '32px', width: '60%', margin: '0 auto 1rem' }} />
              <div className="skeleton" style={{ height: '100px', width: '80%', margin: '0 auto' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const nextVersion = (latestSubmission?.version || 0) + 1;

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopHeader title="Submit Updated Version" />

        <div className="page-body">
          <Link
            to={`/student/submissions/${assignmentId}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
            }}
          >
            <ArrowLeft size={16} /> Back to Feedback
          </Link>

          <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <span className="badge badge-review-needs-changes" style={{ marginBottom: '0.5rem' }}>
                  NEEDS CHANGES REQUESTED
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
                  {assignment?.title}
                </h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Target Version
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-500)', fontFamily: 'monospace' }}>
                  Version {nextVersion}
                </div>
              </div>
            </div>

            {/* Previous Professor Feedback Display */}
            {latestSubmission?.feedback && (
              <div
                style={{
                  padding: '1.25rem',
                  background: 'rgba(249, 115, 22, 0.12)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ fontWeight: '700', color: '#ff9800', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <MessageSquare size={16} /> Previous Professor Feedback (Version {latestSubmission.version}):
                </div>
                <div style={{ color: 'var(--text-main)', fontSize: '0.925rem', lineHeight: '1.5' }}>
                  "{latestSubmission.feedback}"
                </div>
              </div>
            )}

            {/* Updated Version Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={16} /> Updated Text Response / Answer *
                </label>
                <textarea
                  className="form-textarea"
                  rows={6}
                  placeholder="Provide your revised and corrected response addressing the professor's feedback..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Link2 size={16} /> Updated Project / Repository Link
                </label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/username/project-v2"
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.35rem', display: 'block' }}>
                  Your new submission will be saved as Version {nextVersion}. Version {latestSubmission?.version || 1} will remain preserved in history.
                </small>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="submit"
                  className="btn btn-warning"
                  disabled={submitting}
                  style={{ flex: 1, padding: '0.9rem' }}
                >
                  <Send size={18} /> {submitting ? 'Submitting Updated Version...' : `Submit Version ${nextVersion}`}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/student/submissions/${assignmentId}`)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResubmit;
