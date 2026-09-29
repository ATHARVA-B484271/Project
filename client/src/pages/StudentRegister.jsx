import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GraduationCap, ArrowLeft } from 'lucide-react';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    department: 'Computer Science',
    academicYear: '4th Year',
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
    const { name, email, studentId, department, academicYear, password, confirmPassword } = formData;

    if (!name || !email || !studentId || !department || !academicYear || !password || !confirmPassword) {
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
      const res = await API.post('/auth/student/register', formData);
      loginUser(res.data.token, res.data.user);
      showSuccess('Student account registered successfully!');
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
            Student Portal Registration
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Register to view active assignments and submit your coursework
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Atharva Belurkar"
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
              placeholder="e.g. student@university.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Student Roll / ID</label>
              <input
                type="text"
                name="studentId"
                className="form-input"
                placeholder="STU-2026001"
                value={formData.studentId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <select
                name="academicYear"
                className="form-select"
                value={formData.academicYear}
                onChange={handleChange}
                required
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              type="text"
              name="department"
              className="form-input"
              placeholder="e.g. Computer Science"
              value={formData.department}
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
            {loading ? 'Registering...' : 'Register Student Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have a student account?{' '}
          <Link to="/student/login" style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
