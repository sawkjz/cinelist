import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/modules/movies/components/MovieCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
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

  useEffect(() => {
    loadMovies();
  }, [page, selectedGenre]);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const endpoint =
        selectedGenre === "all"
          ? `http://localhost:8081/api/filmes/popular?page=${page}`
          : `http://localhost:8081/api/filmes/genre/${selectedGenre}?page=${page}`;

      const response = await fetch(endpoint);
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

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
    setPage(1); // Reset page when genre changes
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-cinzel font-bold text-foreground">
            Todos os Filmes
          </h1>

          <Select value={selectedGenre} onValueChange={handleGenreChange}>
            <SelectTrigger className="w-[250px]">
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
                disabled={page === 1 || loading}
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
                disabled={loading}
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
              Nenhum filme encontrado
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllMovies;
