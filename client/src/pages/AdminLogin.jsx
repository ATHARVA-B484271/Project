import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, ArrowLeft, LogIn } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    emailOrAdminId: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.emailOrAdminId || !formData.password) {
      showError('Please provide Email/Admin ID and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/auth/admin/login', formData);
      loginUser(res.data.token, res.data.user);
      showSuccess('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 10%, #1e1b4b 0%, #0f172a 80%)',
        padding: '2rem 1rem',
      }}
    >
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--primary-600), var(--accent-purple))',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff' }}>
            Admin Portal Login
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to access your professor control panel
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address or Admin ID</label>
            <input
              type="text"
              name="emailOrAdminId"
              className="form-input"
              placeholder="e.g. admin@example.com or ADM-2026-01"
              value={formData.emailOrAdminId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Authenticating...' : 'Login to Admin Panel'}
          </button>
        </form>

        <div
          style={{
            marginTop: '1.5rem',
            padding: '0.85rem',
            background: 'rgba(99, 102, 241, 0.1)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            fontSize: '0.825rem',
            color: 'var(--text-light)',
          }}
        >
          <strong>Demo Credentials:</strong><br />
          Email: <code>admin@example.com</code><br />
          Password: <code>admin123</code>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Need an admin account?{' '}
          <Link to="/admin/register" style={{ color: 'var(--primary-500)', fontWeight: '600' }}>
            Create Admin Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
