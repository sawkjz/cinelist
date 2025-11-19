import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SignInFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const SignInForm = ({ onSubmit, isLoading }: SignInFormProps) => {
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

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signin-email">Email</Label>
          <Input
            id="signin-email"
            name="signin-email"
            type="email"
            placeholder="seu@email.com"
            disabled={isLoading}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signin-password">Senha</Label>
          <Input
            id="signin-password"
            name="signin-password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            required
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
    </>
  );
};

export default SignInForm;
