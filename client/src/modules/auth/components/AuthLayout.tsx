import { ReactNode } from "react";
import { Film } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
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
        {children}
      </Card>
    </div>
  );
};

export default AuthLayout;
