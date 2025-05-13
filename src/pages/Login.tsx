
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/providers/AuthProvider";
import { RouteGuard } from "@/components/RouteGuard";
import { Loader } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RouteGuard requireAuth={false}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="w-full max-w-md animate-fade-in">
            <div className="bg-card rounded-lg shadow-md border p-6 md:p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground mt-2">
                  Log in to your MagicTools account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log in"
                  )}
                </Button>

                <div className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  This is a demo application. Use any email and password to log in.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setEmail("demo@example.com");
                    setPassword("password");
                  }}
                >
                  Fill with demo credentials
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
