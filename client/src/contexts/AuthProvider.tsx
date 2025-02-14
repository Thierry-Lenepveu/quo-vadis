import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface AuthType {
  token: string;
  user_id: number;
  isAdmin: boolean;
}

interface AuthContextType {
  auth: AuthType | null;
  setAuth: (auth: AuthType) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthType | null>(null);

  const memoAuth = useMemo(
    () => ({
      auth,
      setAuth,
    }),
    [auth],
  );

  useEffect(() => {
    if (auth) {
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/auth`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setAuth({
              token: "",
              user_id: data.user_id,
              isAdmin: data.is_admin,
            });
          });
        }
      })
      .catch((_error) => {
        setAuth(null);
      });
  }, [auth]);

  return (
    <AuthContext.Provider value={memoAuth}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
