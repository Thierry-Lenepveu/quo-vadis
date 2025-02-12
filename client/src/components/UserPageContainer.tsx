import { useAuth } from "../contexts/AuthProvider";
import LoginPage from "../pages/LoginPage";

type PageContainerProps = {
  children: React.ReactNode;
};

function AdminPageContainer({ children }: PageContainerProps) {
  const { auth } = useAuth();

  return <>{auth ? children : <LoginPage />}</>;
}

export default AdminPageContainer;
