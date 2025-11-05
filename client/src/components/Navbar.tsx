import { Link, useLocation } from "react-router-dom";
import { Film, Search, User, Calendar, BookOpen, Star, Home, List } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/dashboard", label: "Início", icon: Home },
    { path: "/search", label: "Pesquisar", icon: Search },
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
                    className={`gap-2 ${
                      isActive(item.path)
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : "text-foreground hover:text-accent"
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
            <Button variant="ghost" size="icon">
              <Star className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
