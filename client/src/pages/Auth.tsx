import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Film } from "lucide-react";
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

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("signup-email") as string;
    const password = formData.get("signup-password") as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setIsLoading(false);

    if (error) {
      toast.error("Erro ao criar conta: " + error.message);
    } else {
      toast.success("Conta criada! Você já pode fazer login.");
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/dashboard");
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
              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
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
                  // required
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
                  // required
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
