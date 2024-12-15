import { Routes, Route, Navigate } from 'react-router-dom';
import { Login, SignUp, GuestAccess } from '@/components/auth';
import { Dashboard } from '@/components/dashboard';
import { ProjectList, ProjectDetails } from '@/components/project';
import { Settings } from '@/components/settings';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <ProtectedRoute requireAuth={false}>
            <SignUp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guest"
        element={
          <ProtectedRoute requireAuth={false}>
            <GuestAccess />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes (require authentication or guest access) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute guestAllowed>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Project Routes */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute guestAllowed>
            <ProjectList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute guestAllowed>
            <ProjectDetails />
          </ProtectedRoute>
        }
      />

      {/* Settings Route (authenticated users only) */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute requireAuth>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
