import { useState, useEffect, useRef, useCallback } from "react";
import type { KeyboardEvent } from "react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/modules/movies/components/MovieCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ArrowRightCircle, Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toFiveStarScale } from "@/utils/rating";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const mapTmdbToMovie = (movie: TmdbMovie): Movie => ({
  id: movie.id,
  title: movie.title,
  year: movie.release_date?.split("-")[0] || "N/A",
  rating: toFiveStarScale(movie.vote_average ?? 0),
  posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder.svg",
  genre: movie.genre_ids?.slice(0, 2).join(", ") || "N/A",
});

const genres = [
  { id: "all", name: "Todos os Gêneros" },
  { id: "28", name: "Ação" },
  { id: "12", name: "Aventura" },
  { id: "16", name: "Animação" },
  { id: "35", name: "Comédia" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentário" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Família" },
  { id: "14", name: "Fantasia" },
  { id: "36", name: "História" },
  { id: "27", name: "Terror" },
  { id: "10402", name: "Música" },
  { id: "9648", name: "Mistério" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Ficção Científica" },
  { id: "53", name: "Thriller" },
  { id: "10752", name: "Guerra" },
  { id: "37", name: "Faroeste" },
];

const AllMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const loadMovies = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint =
        selectedGenre === "all"
          ? `http://localhost:8081/api/filmes/popular?page=${page}`
          : `http://localhost:8081/api/filmes/genre/${selectedGenre}?page=${page}`;

      const response = await fetch(endpoint);
      const data: TmdbResponse = await response.json();

      const formattedMovies: Movie[] = (data.results ?? []).map(mapTmdbToMovie);

      setMovies(formattedMovies);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setLoading(false);
    }
  }, [page, selectedGenre]);

  useEffect(() => {
    if (isSearchMode) {
      return;
    }
    loadMovies();
  }, [isSearchMode, loadMovies]);

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
    setPage(1); // Reset page when genre changes
    setIsSearchMode(false);
    setActiveSearchTerm("");
  };

  const handleSearchToggle = () => {
    setSearchOpen((prev) => {
      const next = !prev;
      if (!prev) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else {
        setSearchTerm("");
      }
      return next;
    });
  };

  const handleSearchSubmit = async () => {
    const term = searchTerm.trim();
    if (!term) return;

    setSearchOpen(false);
    setSearchTerm("");
    setLoading(true);
    setIsSearchMode(true);

    try {
      const response = await fetch(
        `http://localhost:8081/api/filmes/search?query=${encodeURIComponent(term)}&page=1`
      );
      const data: TmdbResponse = await response.json();

      const formattedMovies: Movie[] = (data.results ?? []).map(mapTmdbToMovie);

      setMovies(formattedMovies);
      setActiveSearchTerm(term);
      setPage(1);
      setSelectedGenre("all");
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleClearSearch = () => {
    setIsSearchMode(false);
    setActiveSearchTerm("");
    setSearchOpen(false);
    setSearchTerm("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-4xl font-cinzel font-bold text-foreground">
            Todos os Filmes
          </h1>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
            <div
              className={`flex items-center gap-2 transition-all duration-300 overflow-hidden ${
                searchOpen ? "opacity-100 w-full md:w-80" : "opacity-0 w-0 pointer-events-none"
              }`}
            >
              <Input
                ref={searchInputRef}
                placeholder="Digite o nome do filme"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="bg-card border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
              <Button
                type="button"
                onClick={handleSearchSubmit}
                disabled={!searchTerm.trim() || loading}
                className="bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent transition-colors"
              >
                {loading ? (
                  <div className="h-4 w-4 border-b-2 border-current rounded-full animate-spin" />
                ) : (
                  <ArrowRightCircle className="h-5 w-5" />
                )}
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleSearchToggle}
              className="flex items-center gap-2"
            >
              <SearchIcon
                className={`h-4 w-4 transition-transform ${
                  searchOpen ? "scale-110 text-accent" : ""
                }`}
              />
              <span className="text-sm font-medium hidden md:inline">
                Buscar
              </span>
            </Button>

            <Select value={selectedGenre} onValueChange={handleGenreChange}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Filtrar por gênero" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isSearchMode && activeSearchTerm && !loading && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <p className="text-muted-foreground">
              Mostrando resultados para{" "}
              <span className="text-foreground font-semibold">
                "{activeSearchTerm}"
              </span>
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClearSearch}
              className="justify-start md:justify-end text-accent hover:text-accent"
            >
              Limpar busca
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        )}

        {!loading && movies.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} {...movie} />
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading || isSearchMode}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Anterior
              </Button>

              <span className="flex items-center text-muted-foreground">
                Página {page}
              </span>

              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={loading || isSearchMode}
                variant="outline"
                className="flex items-center gap-2"
              >
                Próxima
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {!loading && movies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {isSearchMode && activeSearchTerm
                ? `Nenhum filme encontrado para "${activeSearchTerm}"`
                : "Nenhum filme encontrado"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllMovies;
