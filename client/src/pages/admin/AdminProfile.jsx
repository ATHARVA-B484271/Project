import React from 'react';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, ShieldCheck, Building } from 'lucide-react';

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopHeader title="Admin Profile" />

        <div className="page-body">
          <div className="card" style={{ maxWidth: '650px', margin: '0 auto', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-600), var(--accent-purple))',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '2rem',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
                  {user?.name}
                </h2>
                <span className="badge badge-active" style={{ marginTop: '0.35rem' }}>
                  ROLE: ADMIN / PROFESSOR
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
                <ShieldCheck size={20} color="var(--accent-purple)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                    Admin / Faculty ID
                  </div>
                  <div style={{ fontSize: '1rem', color: '#fff', fontWeight: '600', fontFamily: 'monospace' }}>
                    {user?.adminId}
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
                <Building size={20} color="var(--accent-teal)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                    Department
                  </div>
                  <div style={{ fontSize: '1rem', color: '#fff', fontWeight: '600' }}>
                    {user?.department || 'Computer Science'}
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

export default AdminProfile;
