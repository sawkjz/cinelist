import { Button } from "@/components/ui/button";

interface SignInFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const SignInForm = ({ onSubmit, isLoading }: SignInFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Button
        type="submit"
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
};

export default SignInForm;
