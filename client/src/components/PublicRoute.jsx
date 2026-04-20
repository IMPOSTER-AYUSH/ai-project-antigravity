import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div className="spinner" />
      </div>
    );
  }

  // If user is logged in, redirect them out of public pages like login/signup
  if (user) {
    if (!user.role) {
      return <Navigate to="/select-role" replace />;
    }
    return <Navigate to={user.role === 'teacher' ? '/teacher' : '/dashboard'} replace />;
  }

  return children;
}
