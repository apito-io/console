import { Outlet } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext";

const AuthWrapper = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default AuthWrapper;
