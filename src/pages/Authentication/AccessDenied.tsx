import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => (
    <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 shadow-lg rounded-lg bg-white dark:bg-gray-800">
            <div className="text-6xl text-danger mb-4">🚫</div>
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="mb-6">You don't have permission to view this page</p>
            <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
            </Link>
        </div>
    </div>
);

export default AccessDenied;
