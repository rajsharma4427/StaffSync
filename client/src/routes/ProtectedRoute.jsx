import { Navigate, useLocation } from 'react-router-dom';
const paths = { HR: '/hr', Manager: '/manager', Employee: '/employee' };
export default function ProtectedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem('staffsync_token');
  let user = null;
  try { user = JSON.parse(localStorage.getItem('staffsync_user') || 'null'); } catch { user = null; }
  const location = useLocation();
  if (!token || !user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={paths[user.role] || '/login'} replace />;
  return children;
}
