import React from 'react';
import { Navigate } from 'react-router-dom';
import { hasPermission } from '../utils/Permissions';

interface PrivateRouteProps {
    children: React.ReactElement;
    requiredPermissions?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredPermissions = [] }) => {
    // Check authentication
    const isAuthenticated = !!localStorage.getItem('token');

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/auth/boxed-signin" replace />;
    }

    // Check permissions if required
    if (requiredPermissions.length > 0 && !hasPermission(requiredPermissions)) {
        return <Navigate to="/access-denied" replace />;
    }

    // User is authenticated and has required permissions
    return children;
};

export default PrivateRoute;
