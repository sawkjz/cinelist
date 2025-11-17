import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignUpFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const SignUpForm = ({ onSubmit, isLoading }: SignUpFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          name="signup-email"
          type="email"
          placeholder="seu@email.com"
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
  );
};

export default SignUpForm;
