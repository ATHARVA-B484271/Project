import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TopHeader = ({ title }) => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 2rem',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        sticky: 'top',
        top: 0,
        zIndex: 99,
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>
          {title}
        </h1>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          Welcome back, {user?.name}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Notification Icon */}
        <button
          style={{
            position: 'relative',
            padding: '0.55rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-light)',
          }}
          title="Notifications"
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-teal)',
            }}
          />
        </button>

        {/* User Info Capsule */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.4rem 0.85rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-600), var(--accent-purple))',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.85rem',
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {user?.role === 'admin' ? `Admin: ${user?.adminId}` : `Student: ${user?.studentId}`}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.55rem', borderRadius: 'var(--radius-md)' }}
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
