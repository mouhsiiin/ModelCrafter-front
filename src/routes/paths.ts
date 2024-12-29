export const ROUTES = {
    // Public routes
    LOGIN: '/login',
    SIGNUP: '/signup',
    GUEST: '/guest',
    
    // Protected routes
    DASHBOARD: '/dashboard',
    PROJECTS: '/projects',
    PROJECT_DETAILS: (projectId: string) => `/projects/${projectId}`,
    AUTO_CRAFTER: '/auto-crafter',
    SETTINGS: '/settings',
  } as const;
  