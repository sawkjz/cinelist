import { Bell, TrendingUp, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-cinema.jpg";

const Dashboard = () => {
  const featuredMovies = [
    { id: 1, title: "O Poderoso Chefão", year: "1972", rating: 9.2, posterUrl: "/placeholder.svg", genre: "Crime, Drama" },
    { id: 2, title: "Clube da Luta", year: "1999", rating: 8.8, posterUrl: "/placeholder.svg", genre: "Drama, Thriller" },
    { id: 3, title: "Interestelar", year: "2014", rating: 8.6, posterUrl: "/placeholder.svg", genre: "Ficção Científica" },
    { id: 4, title: "A Origem", year: "2010", rating: 8.8, posterUrl: "/placeholder.svg", genre: "Ação, Ficção" },
    { id: 5, title: "Parasita", year: "2019", rating: 8.5, posterUrl: "/placeholder.svg", genre: "Drama, Thriller" },
  ];

  const recentActivity = [
    { id: 1, text: "Você assistiu 'Interestelar'", time: "há 2 horas" },
    { id: 2, text: "Nova review de 'Clube da Luta'", time: "há 5 horas" },
    { id: 3, text: "Amigo adicionou 'Parasita'", time: "há 1 dia" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative rounded-2xl overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />
            <div className="relative z-10 p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-cinzel font-bold mb-4 text-foreground">
                Bem-vindo ao CineList
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                Descubra, organize e compartilhe sua paixão por filmes. Acompanhe o que assistiu, 
                crie listas personalizadas e conecte-se com outros cinéfilos.
              </p>
              <Button variant="hero" size="lg">
                Explorar Filmes
              </Button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-cinzel font-bold text-foreground flex items-center gap-2">
              <Bell className="h-6 w-6 text-accent" />
              Notificações
            </h2>
          </div>
          
          <div className="grid gap-3">
            {recentActivity.map((activity) => (
              <Card key={activity.id} className="p-4 bg-card border-border/50 hover:border-accent/50 transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground">{activity.text}</p>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Em Alta */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-cinzel font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-accent" />
              Em Alta Agora
            </h2>
            <Button variant="ghost" className="text-accent hover:text-accent/80">
              Ver Tudo
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredMovies.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </div>
        </section>

        {/* Continue Assistindo */}
        <section>
          <h2 className="text-2xl font-cinzel font-bold mb-6 text-foreground">
            Continue Assistindo
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredMovies.slice(0, 4).map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
