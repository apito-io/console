import { Outlet } from "../../router/navigation";
import { AuthProvider } from "../../contexts/AuthContext";

const AuthWrapper = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default AuthWrapper;
