import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Login, SignUp, GuestAccess } from '@/components/auth';
import { Dashboard } from '@/components/dashboard';
import { DataUploadSection, ProjectDetails } from '@/components/project';
import { DatasetList } from '@/components/dataset';
import { Settings } from '@/components/settings';
import { ProtectedRoute } from './ProtectedRoute';
import { MainNav } from '@/components/nav-bar/MainNav';
import { LandingPage } from '@/components/landing';
import { ProjectsPage } from '@/pages/projects';
import { useAuth } from '@/context/auth';

// Main Routes Component
export const AppRoutes = () => {
  const location = useLocation(); // Get current route location
  const { isAuthenticated } = useAuth(); // Get auth state

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
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />

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
            <ProtectedRoute requireAuth={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Project Routes */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute requireAuth={true}>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute requireAuth={true}>
              <ProjectDetails  />
            </ProtectedRoute>
          }
        />

        <Route
          path="/project_details_guest"
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
            <ProtectedRoute requireAuth={true}>
              <DatasetList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/datasets/:datasetId"
          element={
            <ProtectedRoute requireAuth={true}>
              <DatasetList />
            </ProtectedRoute>
          }
        />

        {/* Auto Crafter Route */}
        <Route
          path="/auto_crafter"
          element={
            <ProtectedRoute requireAuth={true}>
              <DataUploadSection />
            </ProtectedRoute>
          }
        />

        {/* Settings Route */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute requireAuth={true}>
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
