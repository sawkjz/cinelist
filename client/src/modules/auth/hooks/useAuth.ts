import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("signup-email") as string;
    const password = formData.get("signup-password") as string;
    const confirmPassword = formData.get("signup-confirm-password") as string;

    // Validar se as senhas coincidem
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem!");
      setIsLoading(false);
      return;
    }

    // Validar força da senha
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres!");
      setIsLoading(false);
      return;
    }

    try {
      console.log("📝 Tentando criar conta:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error("❌ Erro ao criar conta:", error);
        
        if (error.message.includes("already registered")) {
          toast.error("❌ Este email já está cadastrado!", {
            description: "Tente fazer login na aba Entrar",
            duration: 5000,
          });
        } else if (error.message.includes("signups not allowed")) {
          toast.error("❌ Cadastros desabilitados!", {
            description: "Habilite email provider no Supabase Dashboard",
            duration: 5000,
          });
        } else {
          toast.error("❌ Erro ao criar conta: " + error.message, {
            duration: 5000,
          });
        }
      } else if (data.user) {
        console.log("✅ Conta criada:", data.user.email);
        toast.success("✅ Conta criada com sucesso! Faça login para continuar.", {
          duration: 4000,
        });
        // Trocar para aba de login após 1 segundo
        setTimeout(() => {
          const loginTab = document.querySelector('[value="signin"]') as HTMLElement;
          loginTab?.click();
        }, 1000);
      }
    } catch (err) {
      console.error("❌ Erro crítico ao criar conta:", err);
      toast.error("❌ Erro ao conectar com o servidor Supabase", {
        description: "Verifique sua conexão e as credenciais do .env",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("signin-email") as string;
    const password = formData.get("signin-password") as string;

    // Validação básica
    if (!email || !password) {
      toast.error("Preencha email e senha!");
      setIsLoading(false);
      return;
    }

    try {
      console.log("🔐 Tentando fazer login com:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Erro detalhado:", error);
        
        // Mensagens de erro mais específicas
        if (error.message.includes("Invalid login credentials")) {
          toast.error("❌ Email ou senha incorretos. A conta existe?", {
            description: "Tente criar uma nova conta na aba Cadastrar",
            duration: 5000,
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("❌ Email não confirmado!", {
            description: "Desabilite 'Email confirmation' no Supabase Dashboard",
            duration: 5000,
          });
        } else if (error.message.includes("signups not allowed")) {
          toast.error("❌ Cadastros desabilitados!", {
            description: "Verifique configurações de Auth no Supabase",
            duration: 5000,
          });
        } else {
          toast.error("❌ Erro ao fazer login: " + error.message, {
            description: "Código: " + (error.status || "400"),
            duration: 5000,
          });
        }
      } else if (data.user) {
        console.log("✅ Login bem-sucedido:", data.user.email);
        toast.success("✅ Login realizado com sucesso!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("❌ Erro crítico ao fazer login:", err);
      toast.error("❌ Erro ao conectar com o servidor Supabase", {
        description: "Verifique sua conexão e as credenciais do .env",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignUp,
    handleSignIn,
  };
};
