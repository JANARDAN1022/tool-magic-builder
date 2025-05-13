
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

type RouteGuardProps = {
  children: React.ReactNode;
  requireAuth?: boolean;
};

export function RouteGuard({ children, requireAuth = true }: RouteGuardProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        // Redirect to login if user is not authenticated and route requires auth
        navigate("/login", { 
          replace: true,
          state: { from: location.pathname }
        });
      } else if (!requireAuth && user) {
        // If user is authenticated and route doesn't require auth (like login page), redirect to dashboard
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, isLoading, navigate, requireAuth, location.pathname]);

  // Show nothing while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If requireAuth is true and user is null, we're redirecting so don't render children
  // If requireAuth is false and user exists, we're also redirecting
  if ((requireAuth && !user) || (!requireAuth && user)) {
    return null;
  }

  return <>{children}</>;
}
