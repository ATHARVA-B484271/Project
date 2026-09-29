import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import API from '../../services/api';
import { BookOpen, Clock, Send } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
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

    fetchAssignments();
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopHeader title="Active Assignments" />

        <div className="page-body">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: '0.4rem' }}>
              All Course Assignments
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Submit your work before the deadline to receive an ON TIME status.
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
                No Assignments Found
              </h3>
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

                      {assignment.submissionStatus === 'ON_TIME' && (
                        <span className="badge badge-on-time">ON TIME</span>
                      )}
                      {assignment.submissionStatus === 'LATE' && (
                        <span className="badge badge-late">LATE</span>
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

export default StudentAssignments;
