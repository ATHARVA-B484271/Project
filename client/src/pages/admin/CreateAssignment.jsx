import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { PlusCircle, XCircle } from 'lucide-react';

const CreateAssignment = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !deadline) {
      showError('Please fill in Title, Description, and Deadline.');
      return;
    }

    const selectedDeadline = new Date(deadline);
    if (selectedDeadline <= new Date()) {
      showError('Deadline date and time must be set in the future.');
      return;
    }

    try {
      setLoading(true);
      await API.post('/assignments', {
        title,
        description,
        deadline,
      });

      showSuccess('Assignment created successfully!');
      setTitle('');
      setDescription('');
      setDeadline('');
      navigate('/admin/assignments');
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopHeader title="Create Assignment" />

        <div className="page-body">
          <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: '0.4rem' }}>
                New Assignment Form
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Publish a new assignment for students. Server timestamping will automatically classify student submissions as ON TIME or LATE.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Assignment Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Database Management Assignment 1: Normalization"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assignment Description *</label>
                <textarea
                  className="form-textarea"
                  rows={6}
                  placeholder="Explain requirements, instructions, normal forms, code standards, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Submission Deadline *</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.35rem', display: 'block' }}>
                  Students submitting after this date/time will be marked as LATE.
                </small>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                  <PlusCircle size={18} /> {loading ? 'Publishing...' : 'Create Assignment'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/dashboard')}
                  className="btn btn-secondary"
                >
                  <XCircle size={18} /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignment;
