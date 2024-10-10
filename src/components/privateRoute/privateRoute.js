import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../authContext/authContext.js';

export default function PrivateRoute({ children }) {
    const { currentUser } = useAuth();

    // If still loading the user data, don't redirect or render anything yet
    if (currentUser === undefined) {
        return <div>Loading...</div>;
    }

    return currentUser ? children : <Navigate to="/login" />;
}
