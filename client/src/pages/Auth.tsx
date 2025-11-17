import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Film, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  const fillDemoCredentials = () => {
    const emailInput = document.getElementById("signin-email") as HTMLInputElement;
    const passwordInput = document.getElementById("signin-password") as HTMLInputElement;
    if (emailInput && passwordInput) {
      emailInput.value = "demo@cinelist.com";
      passwordInput.value = "demo123";
      toast.success("Credenciais preenchidas! Clique em Entrar.");
    }
  };

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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-gradient-card border-border/50">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Film className="h-10 w-10 text-accent" />
            <span className="text-3xl font-cinzel font-bold bg-gradient-to-r from-accent to-accent-foreground bg-clip-text text-transparent">
              CineList
            </span>
          </div>
          <p className="text-muted-foreground text-center">
            Sua lista pessoal de filmes
          </p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  name="signin-email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Senha</Label>
                <Input
                  id="signin-password"
                  name="signin-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            
            {/* Informações da Conta Demo - Expansível */}
            <div className="mt-4 border border-accent/20 rounded-lg overflow-hidden bg-accent/5">
              <button
                type="button"
                onClick={() => setShowDemoInfo(!showDemoInfo)}
                className="w-full flex items-center justify-between p-3 hover:bg-accent/10 transition-colors"
              >
                <span className="text-xs text-muted-foreground">
                  🎬 Conta Demo para Teste
                </span>
                {showDemoInfo ? (
                  <ChevronUp className="h-4 w-4 text-accent" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-accent" />
                )}
              </button>
              
              {showDemoInfo && (
                <div className="p-3 pt-0 space-y-2 animate-in slide-in-from-top-2">
                  <div className="flex flex-col gap-1 text-xs text-center py-2">
                    <span className="font-mono text-accent">demo@cinelist.com</span>
                    <span className="font-mono text-accent">demo123</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fillDemoCredentials}
                    className="w-full text-xs h-8 border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Preencher automaticamente
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="signup-email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Senha</Label>
                <Input
                  id="signup-password"
                  name="signup-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo 6 caracteres
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirmar Senha</Label>
                <Input
                  id="signup-confirm-password"
                  name="signup-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
