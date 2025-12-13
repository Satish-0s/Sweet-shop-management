import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        // Redirect to dashboard if not admin but trying to access admin route
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
