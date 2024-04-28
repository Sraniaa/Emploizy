import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Context } from '../main';  // Adjust the import according to your context setup

const SupAdminRoute = ({ children }) => {
    const { user } = useContext(Context);

    if (!user || user.role !== 'SuperAdmin') {
        // Optionally add a notification that the user is not authorized.
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default SupAdminRoute;
