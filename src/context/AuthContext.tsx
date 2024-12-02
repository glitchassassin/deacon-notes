import { createContext, ReactNode, useEffect, useState } from "react";
import fluro from "../../app/services/contacts";

interface AuthContextProps {
  user: any;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Listen for auth changes
    fluro.auth.addEventListener("change", setUser);

    // Initialize user session if exists
    const savedSession = window.localStorage.getItem("userSession");
    if (savedSession) {
      fluro.auth.set(JSON.parse(savedSession));
    }

    return () => {
      fluro.auth.removeEventListener("change", setUser);
    };
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await fluro.auth.login({ username, password });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    fluro.auth.logout();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
