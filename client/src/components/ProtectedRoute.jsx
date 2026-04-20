import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user hasn't selected a role yet, redirect to role selection
  if (!user.role && window.location.pathname !== '/select-role') {
    return <Navigate to="/select-role" replace />;
  }

  // Check role-based access
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'teacher' ? '/teacher' : '/dashboard'} replace />;
  }

  return children;
}
