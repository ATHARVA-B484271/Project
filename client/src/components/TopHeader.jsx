import React, { useState, useEffect } from 'react';
import { Bell, LogOut, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const TopHeader = ({ title }) => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data.notifications || []);
    } catch (err) {
      // Silently catch notification fetch issues
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      // Ignore
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 2rem',
        background: 'rgba(11, 15, 25, 0.65)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative' }}>
        {/* Notification Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
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
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--accent-rose)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '340px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: '1rem',
                zIndex: 1000,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={14} color="var(--primary-500)" /> Notifications
                </span>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Check size={12} /> Mark Read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {notifications.length === 0 ? (
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                    No recent notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: notif.isRead ? 'rgba(15, 23, 42, 0.4)' : 'rgba(99, 102, 241, 0.12)',
                        borderLeft: `3px solid ${
                          notif.type === 'success'
                            ? 'var(--accent-teal)'
                            : notif.type === 'warning'
                            ? '#ff9800'
                            : 'var(--primary-500)'
                        }`,
                        fontSize: '0.825rem',
                      }}
                    >
                      <div style={{ fontWeight: '700', color: '#fff', marginBottom: '0.2rem' }}>
                        {notif.title}
                      </div>
                      <div style={{ color: 'var(--text-light)', lineHeight: '1.4' }}>
                        {notif.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
