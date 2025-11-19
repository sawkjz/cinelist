import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MovieCard from "@/modules/movies/components/MovieCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toFiveStarScale } from "@/utils/rating";

interface Movie {
  id: number;
  title: string;
  year: string;
  rating: number;
  posterUrl: string;
  genre: string;
}

const GenrePage = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genreName, setGenreName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (genreId) {
      fetchMoviesByGenre();
    }
  }, [genreId, page]);

  const fetchMoviesByGenre = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8081/api/filmes/genre/${genreId}?page=${page}`
      );
      const data = await response.json();

      const formattedMovies: Movie[] = data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date?.split("-")[0] || "N/A",
        rating: toFiveStarScale(movie.vote_average),
        posterUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "/placeholder.svg",
        genre: movie.genre_ids?.slice(0, 2).join(", ") || "N/A",
      }));

      setMovies(formattedMovies);
    } catch (error) {
      console.error("Erro ao buscar filmes por gênero:", error);
    } finally {
      setLoading(false);
    }
  };

  const genreNames: { [key: string]: string } = {
    "28": "Ação",
    "12": "Aventura",
    "16": "Animação",
    "35": "Comédia",
    "80": "Crime",
    "99": "Documentário",
    "18": "Drama",
    "10751": "Família",
    "14": "Fantasia",
    "36": "História",
    "27": "Terror",
    "10402": "Música",
    "9648": "Mistério",
    "10749": "Romance",
    "878": "Ficção Científica",
    "10770": "Cinema TV",
    "53": "Thriller",
    "10752": "Guerra",
    "37": "Faroeste",
  };

  useEffect(() => {
    if (genreId) {
      setGenreName(genreNames[genreId] || "Gênero");
    }
  }, [genreId]);

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
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <h1 className="text-4xl font-cinzel font-bold mb-8 text-foreground">
          Filmes de {genreName}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {movies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            variant="outline"
          >
            Página Anterior
          </Button>
          <span className="flex items-center px-4 text-muted-foreground">
            Página {page}
          </span>
          <Button
            onClick={() => setPage((p) => p + 1)}
            variant="outline"
          >
            Próxima Página
          </Button>
        </div>
      </main>
    </div>
  );
};

export default GenrePage;
