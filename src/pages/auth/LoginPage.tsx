import LoginLayout from "./LoginLayout";
import LoginPageContent from "./LoginPageContent";
import { useRedirectIfAuthenticated } from "./useRedirectIfAuthenticated";

const LoginPage = () => {
  useRedirectIfAuthenticated();

  return (
    <LoginLayout>
      <LoginPageContent />
    </LoginLayout>
  );
};

export default LoginPage;
