import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GraduationCap, ArrowLeft } from 'lucide-react';

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    emailOrStudentId: '',
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
    if (!formData.emailOrStudentId || !formData.password) {
      showError('Please enter Email or Student ID and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/auth/student/login', formData);
      loginUser(res.data.token, res.data.user);
      showSuccess('Welcome back!');
      navigate('/student/dashboard');
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
        background: 'radial-gradient(circle at 50% 10%, #0f2b38 0%, #0f172a 80%)',
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
              background: 'linear-gradient(135deg, var(--accent-teal), var(--primary-600))',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <GraduationCap size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff' }}>
            Student Portal Login
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to view assignments and submit your work
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address or Student ID</label>
            <input
              type="text"
              name="emailOrStudentId"
              className="form-input"
              placeholder="e.g. student@example.com or STU-2026001"
              value={formData.emailOrStudentId}
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
            {loading ? 'Logging in...' : 'Login to Student Portal'}
          </button>
        </form>

        <div
          style={{
            marginTop: '1.5rem',
            padding: '0.85rem',
            background: 'rgba(20, 184, 166, 0.1)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(20, 184, 166, 0.2)',
            fontSize: '0.825rem',
            color: 'var(--text-light)',
          }}
        >
          <strong>Demo Student Credentials:</strong><br />
          Email: <code>student@example.com</code><br />
          Password: <code>student123</code>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Don't have a student account?{' '}
          <Link to="/student/register" style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>
            Create Student Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
