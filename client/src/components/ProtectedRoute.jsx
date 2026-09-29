import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-dark)' }}>
        <div className="skeleton" style={{ width: '200px', height: '40px', borderRadius: '12px' }}></div>
      </div>
    );
  }

  if (!user) {
    if (allowedRoles.includes('admin')) {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/student/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
