import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Film, Star, Calendar, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
      }
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair");
    } else {
      toast.success("Logout realizado!");
      navigate("/auth");
    }
  };

  const stats = [
    { icon: Film, label: "Filmes Assistidos", value: "47" },
    { icon: Star, label: "Avaliações", value: "32" },
    { icon: Calendar, label: "Dias Assistindo", value: "156" },
    { icon: Trophy, label: "Conquistas", value: "8" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Card className="p-8 bg-gradient-card border-border/50 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24 border-4 border-accent">
              <AvatarFallback className="bg-accent text-accent-foreground text-2xl">
                {userEmail.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-cinzel font-bold mb-2 text-foreground">
                {userEmail.split('@')[0]}
              </h1>
              <p className="text-muted-foreground mb-4">{userEmail}</p>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 bg-card border-border/50 text-center">
                <Icon className="h-8 w-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        <Card className="p-8 bg-gradient-card border-border/50">
          <h2 className="text-2xl font-cinzel font-bold mb-6 text-foreground flex items-center gap-2">
            <Trophy className="h-6 w-6 text-accent" />
            Desafios
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">Maratona de Clássicos</h3>
              <p className="text-sm text-muted-foreground mb-2">Assista 10 filmes clássicos este mês</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: "60%" }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">6/10 completo</p>
            </div>
            
            <div className="p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">Crítico Cinéfilo</h3>
              <p className="text-sm text-muted-foreground mb-2">Escreva 20 reviews detalhadas</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: "35%" }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">7/20 completo</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
