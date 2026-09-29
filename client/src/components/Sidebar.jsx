import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Send,
  User,
  LogOut,
  BookOpen,
  Menu,
  X,
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
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Create Assignment', path: '/admin/assignments/create', icon: PlusCircle },
    { label: 'My Assignments', path: '/admin/assignments', icon: FileText },
    { label: 'Submissions', path: '/admin/submissions', icon: Send },
    { label: 'Profile', path: '/admin/profile', icon: User },
  ];

  const studentLinks = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Active Assignments', path: '/student/assignments', icon: BookOpen },
    { label: 'My Submissions', path: '/student/submissions', icon: Send },
    { label: 'Profile', path: '/student/profile', icon: User },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1001,
          display: 'none',
          padding: '0.6rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-main)',
        }}
        className="mobile-menu-btn"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        style={{
          width: '260px',
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem',
          minHeight: '100vh',
          transition: 'var(--transition)',
        }}
        className={`sidebar ${isOpen ? 'open' : ''}`}
      >
        <div>
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2.5rem',
              paddingLeft: '0.5rem',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--primary-600), var(--accent-purple))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>
                EduAssign
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {isAdmin ? 'Professor Portal' : 'Student Portal'}
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/admin/dashboard' || link.path === '/student/dashboard'}
                  onClick={() => setIsOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '0.925rem',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(79, 70, 229, 0.25), rgba(139, 92, 246, 0.15))'
                      : 'transparent',
                    borderLeft: isActive ? '3px solid var(--primary-500)' : '3px solid transparent',
                    transition: 'var(--transition)',
                  })}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(15, 23, 42, 0.5)',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isAdmin ? 'var(--primary-600)' : 'var(--accent-teal)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem',
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {user?.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isAdmin ? user?.adminId || 'Admin' : user?.studentId || 'Student'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-block btn-sm"
            style={{ justifyContent: 'flex-start', color: '#fca5a5' }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
