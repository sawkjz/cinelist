import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "./components/HeroSection";
import NotificationsSection from "./components/NotificationsSection";
import TrendingSection from "./components/TrendingSection";
import ContinueWatchingSection from "./components/ContinueWatchingSection";

interface Movie {
  id: number;
  title: string;
  year: string;
  rating: number;
  posterUrl: string;
  genre: string;
}

const DashboardPage = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const fetchPopularMovies = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/filmes/popular?page=1");
      const data = await response.json();
      
      const formattedMovies: Movie[] = data.results.slice(0, 10).map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date?.split("-")[0] || "N/A",
        rating: movie.vote_average || 0,
        posterUrl: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "/placeholder.svg",
        genre: movie.genre_ids?.slice(0, 2).join(", ") || "N/A"
      }));
      
      setPopularMovies(formattedMovies);
    } catch (error) {
      console.error("Erro ao buscar filmes populares:", error);
    } finally {
      setLoading(false);
    }
  };

  const recentActivity = [
    { id: 1, text: "Você assistiu 'Interestelar'", time: "há 2 horas" },
    { id: 2, text: "Nova review de 'Clube da Luta'", time: "há 5 horas" },
    { id: 3, text: "Amigo adicionou 'Parasita'", time: "há 1 dia" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <HeroSection />
        <NotificationsSection activities={recentActivity} />
        <TrendingSection movies={popularMovies} />
        <ContinueWatchingSection movies={popularMovies.slice(0, 4)} />
      </main>
    </div>
  );
};

export default DashboardPage;
