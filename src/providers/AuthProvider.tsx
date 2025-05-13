
import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

type User = {
  id: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Mock authentication functions (replace with actual Supabase auth later)
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // This will be replaced with actual Supabase authentication
      console.log("Logging in with:", email, password);
      
      // Mock successful login
      setUser({ id: 'user-123', email });
      
      // Store in localStorage for session persistence
      localStorage.setItem('auth-user', JSON.stringify({ id: 'user-123', email }));
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // This will be replaced with actual Supabase authentication
      console.log("Signing up with:", email, password);
      
      // Mock successful signup
      setUser({ id: 'user-123', email });
      
      // Store in localStorage for session persistence
      localStorage.setItem('auth-user', JSON.stringify({ id: 'user-123', email }));
      
      toast({
        title: "Sign up successful",
        description: "Welcome to Magic Tools!",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Sign up failed",
        description: "Please try again with a different email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // This will be replaced with actual Supabase logout
      console.log("Logging out");
      
      setUser(null);
      localStorage.removeItem('auth-user');
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('auth-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
