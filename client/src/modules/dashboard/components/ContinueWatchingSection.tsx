import MovieCard from "@/modules/movies/components/MovieCard";

interface Movie {
  id: number;
  title: string;
  year: string;
  rating: number;
  posterUrl: string;
  genre: string;
}

interface ContinueWatchingSectionProps {
  movies: Movie[];
}

const ContinueWatchingSection = ({ movies }: ContinueWatchingSectionProps) => {
  return (
    <section>
      <h2 className="text-2xl font-cinzel font-bold mb-6 text-foreground">
        Continue Assistindo
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
    </section>
  );
};

export default ContinueWatchingSection;
