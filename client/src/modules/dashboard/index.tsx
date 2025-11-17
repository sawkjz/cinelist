import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/modules/movies/components/MovieCard";
import HeroSection from "./components/HeroSection";
import NotificationsSection from "./components/NotificationsSection";
import TrendingSection from "./components/TrendingSection";
import ContinueWatchingSection from "./components/ContinueWatchingSection";
import { supabase } from "@/integrations/supabase/client";

interface Movie {
  id: number;
  title: string;
  year: string;
  rating: number;
  posterUrl: string;
  genre: string;
}

// Cache global para os filmes do dashboard
let dashboardCache: {
  popular: Movie[];
  nowPlaying: Movie[];
  trending: Movie[];
} | null = null;

const DashboardPage = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>(dashboardCache?.popular || []);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>(dashboardCache?.nowPlaying || []);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>(dashboardCache?.trending || []);
  const [loading, setLoading] = useState(!dashboardCache);

  useEffect(() => {
    // Se já tem cache, não precisa carregar
    if (dashboardCache) {
      return;
    }

    // Sincronizar filmes com Supabase em background (sem bloquear a UI)
    syncMoviesWithSupabase();
    
    // Buscar filmes da API do Spring Boot para exibição
    fetchAllMovies();
  }, []);

  const formatMovies = (movies: any[]): Movie[] => {
    return movies.slice(0, 10).map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_date?.split("-")[0] || "N/A",
      rating: movie.vote_average || 0,
      posterUrl: movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/placeholder.svg",
      genre: movie.genre_ids?.slice(0, 2).join(", ") || "N/A"
    }));
  };

  const fetchAllMovies = async () => {
    setLoading(true);
    try {
      const [popularRes, nowPlayingRes, trendingRes] = await Promise.all([
        fetch("http://localhost:8081/api/filmes/popular?page=1"),
        fetch("http://localhost:8081/api/filmes/now-playing?page=1"),
        fetch("http://localhost:8081/api/filmes/trending?page=1")
      ]);

      const [popularData, nowPlayingData, trendingData] = await Promise.all([
        popularRes.json(),
        nowPlayingRes.json(),
        trendingRes.json()
      ]);

      const popular = formatMovies(popularData.results || []);
      const nowPlaying = formatMovies(nowPlayingData.results || []);
      const trending = formatMovies(trendingData.results || []);

      // Salvar no cache global
      dashboardCache = { popular, nowPlaying, trending };

      setPopularMovies(popular);
      setNowPlayingMovies(nowPlaying);
      setTrendingMovies(trending);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setLoading(false);
    }
  };

  const syncMoviesWithSupabase = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('updateMovies', {
        body: {}
      });

      if (error) {
        console.error("Erro ao sincronizar filmes:", error);
        return;
      }

      console.log("✅ Filmes sincronizados com Supabase:", data.message);
    } catch (error) {
      console.error("Erro ao sincronizar filmes:", error);
    }
  };

  const recentActivity = [
    { id: 1, text: "Você assistiu 'Interestelar'", time: "há 2 horas" },
    { id: 2, text: "Nova review de 'Clube da Luta'", time: "há 5 horas" },
    { id: 3, text: "Amigo adicionou 'Parasita'", time: "há 1 dia" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <HeroSection />
        <NotificationsSection activities={recentActivity} />
        
        {/* Filmes em Cartaz */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-cinzel font-bold text-foreground flex items-center gap-2">
              🎬 Filmes em Cartaz
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {loading ? (
              [...Array(10)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-lg" />
              ))
            ) : (
              nowPlayingMovies.map((movie) => (
                <MovieCard key={movie.id} {...movie} />
              ))
            )}
          </div>
        </section>
        
        {/* Em Alta */}
        <TrendingSection movies={trendingMovies} />
        
        {/* Populares */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-cinzel font-bold text-foreground flex items-center gap-2">
              ⭐ Populares
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {loading ? (
              [...Array(10)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-lg" />
              ))
            ) : (
              popularMovies.map((movie) => (
                <MovieCard key={movie.id} {...movie} />
              ))
            )}
          </div>
        </section>
        
        <ContinueWatchingSection movies={loading ? [] : nowPlayingMovies.slice(0, 4)} />
      </main>
    </div>
  );
};

export default DashboardPage;
