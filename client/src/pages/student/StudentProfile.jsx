import React from 'react';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import { useAuth } from '../../context/AuthContext';
import { Mail, GraduationCap, Building, Calendar } from 'lucide-react';

const StudentProfile = () => {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopHeader title="Student Profile" />

        <div className="page-body">
          <div className="card" style={{ maxWidth: '650px', margin: '0 auto', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-teal), var(--primary-600))',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '2rem',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
                  {user?.name}
                </h2>
                <span className="badge badge-on-time" style={{ marginTop: '0.35rem' }}>
                  ROLE: STUDENT
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <Mail size={20} color="var(--primary-500)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                    Email Address
                  </div>
                  <div style={{ fontSize: '1rem', color: '#fff', fontWeight: '600' }}>
                    {user?.email}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <GraduationCap size={20} color="var(--accent-teal)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                    Student Roll / ID Number
                  </div>
                  <div style={{ fontSize: '1rem', color: '#fff', fontWeight: '600', fontFamily: 'monospace' }}>
                    {user?.studentId}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <Building size={20} color="var(--accent-purple)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                    Department
                  </div>
                  <div style={{ fontSize: '1rem', color: '#fff', fontWeight: '600' }}>
                    {user?.department || 'Computer Science'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <Calendar size={20} color="#fbbf24" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                    Academic Year
                  </div>
                  <div style={{ fontSize: '1rem', color: '#fff', fontWeight: '600' }}>
                    {user?.academicYear || '4th Year'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
