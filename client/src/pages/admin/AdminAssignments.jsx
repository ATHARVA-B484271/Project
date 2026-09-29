import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import API from '../../services/api';
import { PlusCircle, Trash2, Eye, Calendar, Clock, FileText } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AdminAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await API.get('/assignments');
      setAssignments(res.data.assignments || []);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await API.delete(`/assignments/${id}`);
      showSuccess('Assignment deleted successfully.');
      fetchAssignments();
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopHeader title="My Assignments" />

        <div className="page-body">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>
                Course Assignments
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Manage all assignments created for your students
              </p>
            </div>
            <Link to="/admin/assignments/create" className="btn btn-primary">
              <PlusCircle size={18} /> Create Assignment
            </Link>
          </div>

          {loading ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div className="skeleton" style={{ height: '30px', width: '70%', margin: '0 auto 1rem' }} />
              <div className="skeleton" style={{ height: '20px', width: '40%', margin: '0 auto' }} />
            </div>
          ) : assignments.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
              <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                No Assignments Published
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Start by creating your first assignment.
              </p>
              <Link to="/admin/assignments/create" className="btn btn-primary">
                <PlusCircle size={18} /> Create Assignment
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {assignments.map((assignment) => (
                <div key={assignment._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span className={`badge ${assignment.status === 'ACTIVE' ? 'badge-active' : 'badge-closed'}`}>
                        {assignment.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={14} /> {new Date(assignment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '0.75rem', lineHeight: '1.3' }}>
                      {assignment.title}
                    </h3>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {assignment.description}
                    </p>
                  </div>

                  <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={14} color="var(--primary-500)" /> Deadline:
                      </span>
                      <strong style={{ color: '#fff' }}>
                        {new Date(assignment.deadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Submissions: <strong style={{ color: 'var(--accent-teal)' }}>{assignment.submissionCount}</strong>
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to="/admin/submissions" className="btn btn-secondary btn-sm">
                          <Eye size={14} /> Submissions
                        </Link>
                        <button onClick={() => handleDelete(assignment._id)} className="btn btn-danger btn-sm">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
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

export default AdminAssignments;
