import { Navigate, Outlet } from "../../router/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { isSuperAdminFromToken } from "../../utils/superAdmin";

const SuperAdminRoute = () => {
  const { decodeTokenData } = useAuth();
  return isSuperAdminFromToken(decodeTokenData()) ? (
    <Outlet />
  ) : (
    <Navigate to="/projects" replace />
  );
};

export default SuperAdminRoute;
