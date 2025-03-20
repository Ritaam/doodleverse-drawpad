
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication functionality - In a real app, replace with actual auth service
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on component mount
    const storedUser = localStorage.getItem('whiteboardUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('whiteboardUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulating API call with timeout - replace with real authentication
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Dummy validation
        if (email && password.length >= 6) {
          // In a real app, you'd validate against a backend
          const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: email.split('@')[0],
          };
          
          setUser(newUser);
          localStorage.setItem('whiteboardUser', JSON.stringify(newUser));
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    // Simulating API call with timeout - replace with real signup
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6 && name) {
          const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name,
          };
          
          setUser(newUser);
          localStorage.setItem('whiteboardUser', JSON.stringify(newUser));
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error('Invalid input'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('whiteboardUser');
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
