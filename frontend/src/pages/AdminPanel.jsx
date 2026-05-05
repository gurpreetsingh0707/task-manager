import React from 'react';
import Navbar from '../components/common/Navbar';

export default function AdminPanel() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">🛡️ Admin Panel</h1>
                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-gray-600">
                        Welcome to the Admin Panel. This area is restricted to administrators only.
                        You can add user management and platform-wide analytics here.
                    </p>
                </div>
            </div>
        </div>
    );
}
