import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            Sistema de Gestão de Pacientes
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Gerencie cadastros de pacientes de forma simples e eficiente
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group" 
                onClick={() => navigate("/pacientes")}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Pacientes</h2>
              <p className="text-muted-foreground">
                Cadastre, edite, visualize e gerencie informações completas dos pacientes
              </p>
              <Button className="gap-2 group-hover:gap-4 transition-all">
                Acessar
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 opacity-60">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-muted rounded-full">
                <Users className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Outras Funcionalidades</h2>
              <p className="text-muted-foreground">
                Mais módulos em breve
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
