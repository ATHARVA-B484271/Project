import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, ArrowLeft, BookOpen } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ emailOrAdminId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.emailOrAdminId || !formData.password) { showError('Please fill in all fields.'); return; }
    try {
      setLoading(true);
      const res = await API.post('/auth/admin/login', formData);
      loginUser(res.data.token, res.data.user);
      showSuccess('Welcome back, Professor!');
      navigate('/admin/dashboard');
    } catch (err) { showError(err.message || 'Login failed. Check credentials.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.82rem', fontWeight: '500', marginBottom: '1.75rem', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="auth-logo">
          <div className="auth-logo-icon"><BookOpen size={20} /></div>
          <span className="auth-logo-text">Edu<span style={{ color: '#2563eb' }}>Assign</span></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} color="#2563eb" />
          </div>
          <h1 className="auth-title" style={{ marginBottom: 0 }}>Admin Portal</h1>
        </div>
        <p className="auth-subtitle">Sign in to access your professor control panel</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address or Admin ID</label>
            <input type="text" name="emailOrAdminId" className="form-input" placeholder="admin@example.com or ADM-2026-01"
              value={formData.emailOrAdminId} onChange={handleChange} required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" placeholder="Enter your password"
              value={formData.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}
            style={{ marginTop: '1.25rem', padding: '0.75rem', fontSize: '0.95rem' }}>
            {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
          </button>
        </form>

        {/* Demo credentials */}
        <div style={{ marginTop: '1.25rem', padding: '0.875rem 1rem', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe', fontSize: '0.82rem', color: '#1e40af' }}>
          <strong>🎓 Demo Credentials</strong><br />
          Email: <code style={{ background: '#dbeafe', padding: '1px 4px', borderRadius: '4px' }}>admin@example.com</code> &nbsp;
          Password: <code style={{ background: '#dbeafe', padding: '1px 4px', borderRadius: '4px' }}>admin123</code>
        </div>

        <div className="auth-switch">
          Don't have an admin account?{' '}
          <Link to="/admin/register">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
