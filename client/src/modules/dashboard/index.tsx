import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/modules/movies/components/MovieCard";
import HeroSection from "./components/HeroSection";
import NotificationsSection from "./components/NotificationsSection";
import TrendingSection from "./components/TrendingSection";
import ContinueWatchingSection from "./components/ContinueWatchingSection";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toFiveStarScale } from "@/utils/rating";

interface Movie {
  id: number;
  title: string;
  year: string;
  rating: number;
  posterUrl: string;
  genre: string;
}

interface TmdbMovie {
  id: number;
  title: string;
  release_date?: string;
  vote_average?: number;
  poster_path?: string | null;
  genre_ids?: number[];
}

interface TmdbResponse {
  results?: TmdbMovie[];
}

const formatMovies = (movies: TmdbMovie[]): Movie[] =>
  movies.slice(0, 10).map((movie) => ({
    id: movie.id,
    title: movie.title,
    year: movie.release_date?.split("-")[0] || "N/A",
    rating: toFiveStarScale(movie.vote_average ?? 0),
    posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder.svg",
    genre: movie.genre_ids?.slice(0, 2).join(", ") || "N/A",
  }));

// Cache global para os filmes do dashboard
let dashboardCache: {
  popular: Movie[];
  nowPlaying: Movie[];
  trending: Movie[];
} | null = null;

const DashboardPage = () => {
  const navigate = useNavigate();
  const [popularMovies, setPopularMovies] = useState<Movie[]>(dashboardCache?.popular || []);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>(dashboardCache?.nowPlaying || []);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>(dashboardCache?.trending || []);
  const [loading, setLoading] = useState(!dashboardCache);

  const fetchAllMovies = useCallback(async () => {
    setLoading(true);
    try {
      const [popularRes, nowPlayingRes, trendingRes] = await Promise.all([
        fetch("http://localhost:8081/api/filmes/popular?page=1"),
        fetch("http://localhost:8081/api/filmes/now-playing?page=1"),
        fetch("http://localhost:8081/api/filmes/trending?page=1")
      ]);

      const [popularData, nowPlayingData, trendingData]: TmdbResponse[] = await Promise.all([
        popularRes.json(),
        nowPlayingRes.json(),
        trendingRes.json()
      ]);

      const popular = formatMovies(popularData.results ?? []);
      const nowPlaying = formatMovies(nowPlayingData.results ?? []);
      const trending = formatMovies(trendingData.results ?? []);

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
  }, []);

  const syncMoviesWithSupabase = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    // Se já tem cache, não precisa carregar
    if (dashboardCache) {
      return;
    }

    // Sincronizar filmes com Supabase em background (sem bloquear a UI)
    syncMoviesWithSupabase();
    
    // Buscar filmes da API do Spring Boot para exibição
    fetchAllMovies();
  }, [fetchAllMovies, syncMoviesWithSupabase]);

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

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/all-movies")}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-film h-4 w-4 mr-2"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 3v18" />
              <path d="M3 7.5h4" />
              <path d="M3 12h18" />
              <path d="M3 16.5h4" />
              <path d="M17 3v18" />
              <path d="M17 7.5h4" />
              <path d="M17 16.5h4" />
            </svg>
            Ver mais
          </button>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
