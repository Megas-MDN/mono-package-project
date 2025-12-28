import { Navigate, Outlet } from 'react-router-dom';
import { useZUserProfile } from '../stores/useZUserProfile';

export const ProtectedRoute = () => {
  const token = useZUserProfile((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
