import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import MovieCard from "@/modules/movies/components/MovieCard";

interface Movie {
  id: number;
  title: string;
  year: string;
  rating: number;
  posterUrl: string;
  genre: string;
}

interface TrendingSectionProps {
  movies: Movie[];
}

const TrendingSection = ({ movies }: TrendingSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-cinzel font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-accent" />
          Em Alta Agora
        </h2>
        <Button 
          variant="ghost" 
          className="text-accent hover:text-accent/80"
          onClick={() => navigate("/all-movies")}
        >
          Ver Tudo
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;
