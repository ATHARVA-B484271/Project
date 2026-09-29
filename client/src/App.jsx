import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import AdminRegister from './pages/AdminRegister';
import AdminLogin from './pages/AdminLogin';
import StudentRegister from './pages/StudentRegister';
import StudentLogin from './pages/StudentLogin';

// Admin Pages (Level 1 & Level 2)
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAssignments from './pages/admin/AdminAssignments';
import CreateAssignment from './pages/admin/CreateAssignment';
import AdminSubmissions from './pages/admin/AdminSubmissions';
import AdminReviewSubmission from './pages/admin/AdminReviewSubmission';
import AdminProfile from './pages/admin/AdminProfile';

// Student Pages (Level 1 & Level 2)
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentAssignmentDetails from './pages/student/StudentAssignmentDetails';
import StudentFeedback from './pages/student/StudentFeedback';
import StudentResubmit from './pages/student/StudentResubmit';
import StudentHistory from './pages/student/StudentHistory';
import StudentSubmissions from './pages/student/StudentSubmissions';
import StudentProfile from './pages/student/StudentProfile';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />

          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/login" element={<StudentLogin />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/assignments"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/assignments/create"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateAssignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/submissions"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSubmissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/submissions/:id/review"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReviewSubmission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProfile />
              </ProtectedRoute>
            }
          />

          {/* Student Protected Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/assignments"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/assignments/:id"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentAssignmentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/submissions"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentSubmissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/submissions/:assignmentId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentFeedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/submissions/:assignmentId/update"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentResubmit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/submissions/:assignmentId/history"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
