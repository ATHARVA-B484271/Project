import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, FileText, Send,
  User, LogOut, BookOpen, Menu, X, GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Sidebar = () => {
  const { user, logoutUser, isAdmin } = useAuth();
  const { showInfo } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    showInfo('Logged out successfully.');
    navigate('/');
  };

  const adminLinks = [
    { label: 'Dashboard',          path: '/admin/dashboard',            icon: LayoutDashboard },
    { label: 'Create Assignment',   path: '/admin/assignments/create',   icon: PlusCircle },
    { label: 'My Assignments',      path: '/admin/assignments',          icon: FileText },
    { label: 'Submissions',         path: '/admin/submissions',          icon: Send },
    { label: 'Profile',             path: '/admin/profile',              icon: User },
  ];

  const studentLinks = [
    { label: 'Dashboard',           path: '/student/dashboard',          icon: LayoutDashboard },
    { label: 'Assignments',         path: '/student/assignments',        icon: BookOpen },
    { label: 'My Submissions',      path: '/student/submissions',        icon: Send },
    { label: 'Profile',             path: '/student/profile',            icon: User },
  ];

  const links = isAdmin ? adminLinks : studentLinks;
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-menu-btn"
        style={{
          position: 'fixed', top: '14px', left: '1rem', zIndex: 1001,
          display: 'none',
          padding: '0.5rem',
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          color: '#475569',
          boxShadow: '0 1px 4px rgba(0,0,0,.1)',
        }}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '240px',
          background: '#fff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '100vh',
          flexShrink: 0,
        }}
      >
        {/* Top section */}
        <div>
          {/* Brand */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '1.25rem 1.5rem 1.25rem',
            borderBottom: '1px solid #f1f5f9',
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '8px',
              background: '#2563eb',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', flexShrink: 0,
            }}>
              <BookOpen size={18} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.2 }}>
                Edu<span style={{ color: '#2563eb' }}>Assign</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isAdmin ? 'Professor Portal' : 'Student Portal'}
              </div>
            </div>
          </div>

          {/* Role pill */}
          <div style={{ padding: '1rem 1.5rem 0.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.3rem 0.75rem',
              background: isAdmin ? '#eff6ff' : '#f0fdf4',
              color: isAdmin ? '#1d4ed8' : '#15803d',
              border: `1px solid ${isAdmin ? '#bfdbfe' : '#bbf7d0'}`,
              borderRadius: '999px',
              fontSize: '0.75rem', fontWeight: '700',
            }}>
              {isAdmin ? <GraduationCap size={13} /> : <User size={13} />}
              {isAdmin ? 'Professor' : 'Student'}
            </div>
          </div>

          {/* Nav */}
          <nav style={{ padding: '0.75rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path.endsWith('/dashboard')}
                  onClick={() => setIsOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.875rem',
                    borderRadius: '8px',
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '0.875rem',
                    color: isActive ? '#1d4ed8' : '#475569',
                    background: isActive ? '#eff6ff' : 'transparent',
                    transition: 'all 0.15s',
                    textDecoration: 'none',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={17} style={{ color: isActive ? '#2563eb' : '#94a3b8', flexShrink: 0 }} />
                      <span>{link.label}</span>
                      {isActive && (
                        <div style={{
                          marginLeft: 'auto', width: '6px', height: '6px',
                          borderRadius: '50%', background: '#2563eb', flexShrink: 0,
                        }} />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User + Logout */}
        <div style={{ padding: '1rem 1rem', borderTop: '1px solid #f1f5f9' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.65rem',
            padding: '0.75rem',
            background: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            marginBottom: '0.75rem',
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: isAdmin ? '#2563eb' : '#16a34a',
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '0.875rem', flexShrink: 0,
            }}>
              {initial}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontSize: '0.82rem', fontWeight: '700', color: '#0f172a',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {isAdmin ? user?.adminId || 'Admin' : user?.studentId || 'Student'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.6rem 0.875rem',
              borderRadius: '8px',
              color: '#dc2626',
              background: 'transparent',
              border: '1px solid #fee2e2',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.15s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
