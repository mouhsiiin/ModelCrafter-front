import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;  // If true, user must be logged in
  guestAllowed?: boolean; // If true, guest users can access
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  guestAllowed = false,
}) => {
  const { isAuthenticated, isGuest } = useAuth();
  const location = useLocation();


  // If auth is required and user is not authenticated
  if (requireAuth && !isAuthenticated && (!guestAllowed || !isGuest)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but tries to access auth pages
  if (isAuthenticated && ['/login', '/signup', '/guest'].includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
