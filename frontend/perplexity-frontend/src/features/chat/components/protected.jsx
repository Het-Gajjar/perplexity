import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Protected({ children }) {

    const user = useSelector((state) => state.auth.user)
    const loading = useSelector((state) => state.auth.loading)
    // If there is no user logged in, redirect to the login page
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Otherwise, render the protected children or the nested routes
    return children ? children : <Outlet />;
}
