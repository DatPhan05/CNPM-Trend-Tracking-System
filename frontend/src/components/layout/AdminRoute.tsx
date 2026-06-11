import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  role?: string;
}

export default function AdminRoute() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    if (decoded.role?.toUpperCase() !== 'ADMIN') {
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
