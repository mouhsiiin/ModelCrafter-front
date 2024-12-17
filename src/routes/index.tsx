import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Login, SignUp, GuestAccess } from '@/components/auth';
import { Dashboard } from '@/components/dashboard';
import { ProjectDetails } from '@/components/project';
import { DatasetList } from '@/components/dataset';
import { VisualizationsPage } from '@/components/visualizations';
import { Settings } from '@/components/settings';
import { ProtectedRoute } from './ProtectedRoute';
import { MainNav } from '@/components/nav-bar/MainNav';
import { LandingPage } from '@/components/landing';
import { ProjectsPage } from '@/pages/projects';

// Main Routes Component
export const AppRoutes = () => {
  const location = useLocation(); // Get current route location

  // Paths where Navbar should NOT appear
  const authPaths = ['/login', '/signup', '/guest'];

  // Check if current route is in authPaths
  const hideNavbar = authPaths.includes(location.pathname);

  return (
    <>
      {/* Conditionally Render Navbar */}
      {!hideNavbar && <MainNav />}

      {/* Define Routes */}
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication Routes */}
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
              <ProjectsPage />
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
        {/* Settings Route */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute requireAuth>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect for Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};
