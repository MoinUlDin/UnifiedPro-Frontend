import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    // Check for authentication (you can use Redux, Context API, or localStorage)
    const isAuthenticated = !!localStorage.getItem('token'); // Example check

    return isAuthenticated ? children : <Navigate to="/auth/boxed-signin" replace />;
};

export default PrivateRoute;