import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import Modal from '../../components/Modal';
import API from '../../services/api';
import { Eye, ExternalLink, Send, Clock, User, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await API.get('/submissions');
      setSubmissions(res.data.submissions || []);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleOpenModal = (sub) => {
    setSelectedSubmission(sub);
    setIsModalOpen(true);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopHeader title="Student Submissions" />

        <div className="page-body">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: '0.4rem' }}>
              Received Submissions
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Inspect student answers, repository links, and automatic ON TIME vs LATE compliance.
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
                No Submissions Received Yet
              </h3>
              <p style={{ color: 'var(--text-muted)' }}>
                When students submit their work for your assignments, they will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Assignment</th>
                    <th>Submitted At</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub._id}>
                      <td>
                        <div style={{ fontWeight: '700', color: '#fff' }}>{sub.studentId?.name || 'N/A'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sub.studentId?.email}</div>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: '600', color: 'var(--text-light)' }}>
                          {sub.studentId?.studentId || 'N/A'}
                        </span>
                      </td>
                      <td style={{ fontWeight: '600', color: '#fff' }}>
                        {sub.assignmentId?.title || 'Assignment Deleted'}
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
                        <button
                          onClick={() => handleOpenModal(sub)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Eye size={14} /> View Submission
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Submission Details Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Student Submission Details"
          >
            {selectedSubmission && (
              <div>
                {/* Student Details Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.25rem',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '700' }}>
                      {selectedSubmission.studentId?.name}
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                      ID: {selectedSubmission.studentId?.studentId} | {selectedSubmission.studentId?.email}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                      Dept: {selectedSubmission.studentId?.department} | {selectedSubmission.studentId?.academicYear}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`badge ${
                        selectedSubmission.status === 'ON_TIME' ? 'badge-on-time' : 'badge-late'
                      }`}
                    >
                      {selectedSubmission.status === 'ON_TIME' ? 'ON TIME' : 'LATE'}
                    </span>
                  </div>
                </div>

                {/* Assignment Title */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                    Assignment Title
                  </label>
                  <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700', marginTop: '0.2rem' }}>
                    {selectedSubmission.assignmentId?.title}
                  </p>
                </div>

                {/* Timestamps */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                      Deadline
                    </label>
                    <p style={{ color: '#fff', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      {selectedSubmission.assignmentId?.deadline
                        ? new Date(selectedSubmission.assignmentId.deadline).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                      Submitted At
                    </label>
                    <p style={{ color: '#fff', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      {new Date(selectedSubmission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Student Response */}
                {selectedSubmission.response && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                      Student Answer / Text Response
                    </label>
                    <div
                      style={{
                        padding: '1rem',
                        background: 'rgba(15, 23, 42, 0.9)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-light)',
                        fontSize: '0.925rem',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {selectedSubmission.response}
                    </div>
                  </div>
                )}

                {/* Submission Link */}
                {selectedSubmission.submissionLink && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                      Project / Submission Repository Link
                    </label>
                    <a
                      href={selectedSubmission.submissionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-block"
                      style={{ gap: '0.5rem' }}
                    >
                      Open Submission Link <ExternalLink size={16} />
                    </a>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminSubmissions;
