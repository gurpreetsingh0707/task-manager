import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute({ children, adminOnly = false }) {
    const { user } = useAuth();
    const location = useLocation();

    // Not logged in → redirect to login, save current path
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Admin-only route but user is not admin
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
}