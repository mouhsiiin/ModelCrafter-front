import { Routes, Route, Navigate } from 'react-router-dom';
import { Login, SignUp, GuestAccess } from '@/components/auth';
import { Dashboard } from '@/components/dashboard';
import { ProjectList, ProjectDetails } from '@/components/project';
import { DatasetList } from '@/components/dataset';
import { VisualizationsPage } from '@/components/visualizations';
import { Settings } from '@/components/settings';
import { ProtectedRoute } from './ProtectedRoute';
import { MainNav } from './MainNav';

export const AppRoutes = () => {
  return (
    <>
      <MainNav />
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

        {/* Protected Routes */}
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

        {/* Dataset Routes */}
        <Route
          path="/datasets"
          element={
            <ProtectedRoute guestAllowed>
              <DatasetList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/datasets/:datasetId"
          element={
            <ProtectedRoute guestAllowed>
              <DatasetList />
            </ProtectedRoute>
          }
        />

        {/* Visualization Route */}
        <Route
          path="/visualizations"
          element={
            <ProtectedRoute guestAllowed>
              <VisualizationsPage />
            </ProtectedRoute>
          }
        />

        {/* Settings Route */}
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
    </>
  );
};