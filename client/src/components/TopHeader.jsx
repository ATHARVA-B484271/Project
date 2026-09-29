import React, { useState, useEffect, useRef } from 'react';
import { Bell, LogOut, Check, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const TopHeader = ({ title }) => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data.notifications || []);
    } catch (err) {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (bellRef.current && !bellRef.current.contains(e.target)) setShowNotifications(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const handleLogout = () => { logoutUser(); navigate('/'); };
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';
  const isAdmin = user?.role === 'admin';

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      height: '64px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,.04)',
      position: 'sticky',
      top: 0,
      zIndex: 99,
      flexShrink: 0,
    }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.2 }}>{title}</h1>
        <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '1px' }}>
          Welcome back, <strong style={{ color: '#64748b' }}>{user?.name}</strong>
        </p>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

        {/* Notification Bell */}
        <div ref={bellRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative',
              width: '38px', height: '38px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#475569',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
              cursor: 'pointer',
            }}
            title="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '6px', right: '6px',
                width: '8px', height: '8px',
                borderRadius: '50%',
                background: '#ef4444',
                border: '2px solid #fff',
              }} />
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0,
              width: '360px',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              boxShadow: '0 10px 40px rgba(0,0,0,.12)',
              zIndex: 1000,
              overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.875rem 1rem',
                borderBottom: '1px solid #f1f5f9',
              }}>
                <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Bell size={14} color="#2563eb" />
                  Notifications
                  {unreadCount > 0 && (
                    <span style={{ padding: '0.1rem 0.5rem', background: '#eff6ff', color: '#2563eb', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '700' }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer' }}>
                    <Check size={12} /> Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                    <Bell size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif._id || notif.id} style={{
                      padding: '0.875rem 1rem',
                      borderBottom: '1px solid #f8fafc',
                      borderLeft: `3px solid ${notif.type === 'success' ? '#22c55e' : notif.type === 'warning' ? '#f97316' : '#3b82f6'}`,
                      background: notif.isRead ? '#fff' : '#f8faff',
                      transition: 'background 0.15s',
                    }}>
                      <div style={{ fontWeight: '600', fontSize: '0.82rem', color: '#0f172a', marginBottom: '2px' }}>
                        {notif.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
                        {notif.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '28px', background: '#e2e8f0' }} />

        {/* User Capsule */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.35rem 0.75rem 0.35rem 0.4rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '999px',
          cursor: 'default',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: isAdmin ? '#2563eb' : '#16a34a',
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '700', fontSize: '0.78rem',
          }}>
            {initial}
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>{user?.name}</div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
              {isAdmin ? 'Professor' : 'Student'}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.45rem 0.85rem',
            borderRadius: '8px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            color: '#64748b',
            fontSize: '0.82rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          title="Sign out"
          onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = '#fecaca'; e.currentTarget.style.background = '#fef2f2'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
