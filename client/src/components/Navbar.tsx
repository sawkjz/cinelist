import { Link, useLocation } from "react-router-dom";
import { Film, Search, User, Calendar, BookOpen, Star, Home, List, LogOut, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const location = useLocation();
  const { signOut } = useAuthContext();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };
  
  const navItems = [
    { path: "/dashboard", label: "Início", icon: Home },
    { path: "/search", label: "Pesquisar", icon: Search },
    { path: "/categories", label: "Categorias", icon: Grid },
    { path: "/my-list", label: "Minha Lista", icon: List },
    { path: "/collections", label: "Coleções", icon: BookOpen },
    { path: "/calendar", label: "Calendário", icon: Calendar },
    { path: "/profile", label: "Perfil", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <Film className="h-6 w-6 text-accent" />
            <span className="text-xl font-cinzel font-bold bg-gradient-to-r from-accent to-accent-foreground bg-clip-text text-transparent">
              CineList
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={`gap-2 transition-colors ${
                      isActive(item.path)
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : "text-foreground hover:bg-foreground hover:text-background"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-foreground hover:text-background transition-colors"
            >
              <Star className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              title="Sair"
              className="hover:bg-foreground hover:text-background transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
