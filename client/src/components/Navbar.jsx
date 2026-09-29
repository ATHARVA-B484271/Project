import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem 2.5rem',
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--primary-600), var(--accent-purple))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <BookOpen size={22} />
        </div>
        <span style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          EduAssign
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <a href="#home" style={{ color: 'var(--text-light)', fontWeight: '500', fontSize: '0.95rem' }}>Home</a>
        <a href="#about" style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.95rem' }}>About</a>
        <a href="#features" style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.95rem' }}>Features</a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {user ? (
          <Link
            to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
            className="btn btn-primary btn-sm"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link to="/student/login" className="btn btn-secondary btn-sm">
              <LogIn size={16} /> Student Login
            </Link>
            <Link to="/admin/login" className="btn btn-primary btn-sm">
              <UserPlus size={16} /> Admin Portal
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
