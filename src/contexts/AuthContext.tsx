import { createContext, useState, type ReactNode, useEffect } from "react";
import * as authSvc from "../services/auth";

type User = Awaited<ReturnType<typeof authSvc.login>>;

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (token && stored) {
      try {
        setUser(JSON.parse(stored) as User);
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const u = await authSvc.login({ email, password });
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  };

  const register = async (email: string, password: string) => {
    const u = await authSvc.register({ email, password });
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ loading, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
