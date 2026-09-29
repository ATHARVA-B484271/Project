import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,.06)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem',
        height: '64px',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '8px',
            background: '#2563eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            flexShrink: 0,
          }}>
            <BookOpen size={20} />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
            Edu<span style={{ color: '#2563eb' }}>Assign</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="nav-links-desktop">
          {['#home', '#about', '#features'].map((href, i) => (
            <a key={href} href={href} style={{
              color: i === 0 ? '#1e293b' : '#64748b',
              fontWeight: '500',
              fontSize: '0.9rem',
              transition: 'color 0.15s',
              padding: '0.25rem 0',
              borderBottom: i === 0 ? '2px solid #2563eb' : '2px solid transparent',
            }}
              onMouseEnter={e => e.target.style.color = '#1e293b'}
              onMouseLeave={e => { if (i !== 0) e.target.style.color = '#64748b'; }}
            >
              {['Home', 'About', 'Features'][i]}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <Link
              to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
              className="btn btn-primary btn-sm"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/student/login"
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <LogIn size={15} /> Student Login
              </Link>
              <Link
                to="/admin/login"
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <UserPlus size={15} /> Admin Portal
              </Link>
            </>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              padding: '0.4rem',
              color: '#475569',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div style={{
          background: '#fff',
          borderTop: '1px solid #e2e8f0',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <a href="#home" style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>Home</a>
          <a href="#about" style={{ color: '#64748b', fontWeight: '500', fontSize: '0.9rem' }}>About</a>
          <a href="#features" style={{ color: '#64748b', fontWeight: '500', fontSize: '0.9rem' }}>Features</a>
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
            <Link to="/student/login" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Student Login</Link>
            <Link to="/admin/login" className="btn btn-primary btn-sm" style={{ flex: 1 }}>Admin Portal</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
