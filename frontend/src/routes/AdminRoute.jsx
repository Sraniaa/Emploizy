import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Context } from '../main';  // Adjust the import according to your context setup

const AdminRoute = ({ children }) => {
    const { user } = useContext(Context);

    // Check if user exists and if their role is either 'Admin' or 'SuperAdmin'
    if (!user || (user.role !== 'Admin' && user.role !== 'SuperAdmin')) {
        // Optionally add a notification that the user is not authorized.
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default AdminRoute;
