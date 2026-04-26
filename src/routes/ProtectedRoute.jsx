import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../components/common/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader label="Checking session" />;

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
}
