import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface BackendUser {
  id: number;
  email: string;
  nome: string;
  avatarUrl?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  backendUser: BackendUser | null;
  signOut: () => Promise<void>;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const syncBackendUser = async () => {
      if (!user?.email) {
        setBackendUser(null);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single();

        const payload = {
          externalId: user.id,
          email: user.email,
          nome: profile?.full_name || user.user_metadata?.full_name || user.email,
          avatarUrl: profile?.avatar_url || null,
        };

        const response = await fetch(`${BACKEND_URL}/api/usuarios/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Falha ao sincronizar usuário");
        }

        const data = await response.json();
        setBackendUser(data);
      } catch (error) {
        console.error("Erro ao sincronizar usuário com backend:", error);
      }
    };

    syncBackendUser();
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBackendUser(null);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, loading, backendUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
