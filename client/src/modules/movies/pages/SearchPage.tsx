import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MovieCard from "../components/MovieCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  year: string;
  rating: number;
  posterUrl: string;
  genre: string;
}

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // Carregar sugestões em background sem bloquear a UI
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/filmes/trending?page=1");
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
      
      setSuggestions(formattedMovies);
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(
        `http://localhost:8081/api/filmes/search?query=${encodeURIComponent(searchTerm)}&page=1`
      );
      const data = await response.json();

      const formattedMovies: Movie[] = data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date?.split("-")[0] || "N/A",
        rating: movie.vote_average || 0,
        posterUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "/placeholder.svg",
        genre: movie.genre_ids?.slice(0, 2).join(", ") || "N/A",
      }));

      setMovies(formattedMovies);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-cinzel font-bold mb-8 text-foreground">
          Pesquisar Filmes
        </h1>

        <div className="flex gap-2 mb-8">
          <Input
            placeholder="Digite o nome do filme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            ) : (
              <SearchIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        )}

        {!loading && searched && movies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum filme encontrado para "{searchTerm}"
            </p>
          </div>
        )}

        {!loading && movies.length > 0 && (
          <>
            <p className="text-muted-foreground mb-4">
              {movies.length} resultado(s) encontrado(s) para "{searchTerm}"
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} {...movie} />
              ))}
            </div>
          </>
        )}

        {!searched && loadingSuggestions && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">
              Sugestões para você
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {!searched && !loadingSuggestions && suggestions.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">
              Sugestões para você
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {suggestions.map((movie) => (
                <MovieCard key={movie.id} {...movie} />
              ))}
            </div>
          </div>
        )}

        {!searched && !loadingSuggestions && suggestions.length === 0 && (
          <div className="text-center py-12">
            <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">
              Digite o nome de um filme para começar a pesquisa
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
