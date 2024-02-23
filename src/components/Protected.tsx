import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth" />;

  return <>{children}</>;
}

export default Protected;
