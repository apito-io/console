import { Navigate, Outlet, useLocation } from "../../router/navigation";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated() ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
  );
};

export default ProtectedRoute;
