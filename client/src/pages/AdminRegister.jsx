import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, ArrowLeft, Lock, Mail, User, Building, Hash } from 'lucide-react';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    adminId: '',
    department: 'Computer Science',
    password: '',
    confirmPassword: '',
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
    const { name, email, adminId, department, password, confirmPassword } = formData;

    if (!name || !email || !adminId || !department || !password || !confirmPassword) {
      showError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/auth/admin/register', formData);
      loginUser(res.data.token, res.data.user);
      showSuccess('Admin account created successfully!');
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
      <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2.5rem' }}>
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
            Admin / Professor Portal
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Create an administrator account to manage assignments
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Prof. Alan Turing"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="e.g. professor@university.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Admin / Faculty ID</label>
              <input
                type="text"
                name="adminId"
                className="form-input"
                placeholder="ADM-101"
                value={formData.adminId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                name="department"
                className="form-input"
                placeholder="Computer Science"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Creating Admin Account...' : 'Register as Admin'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an admin account?{' '}
          <Link to="/admin/login" style={{ color: 'var(--primary-500)', fontWeight: '600' }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
