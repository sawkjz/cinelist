import { useState } from "react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const movies = [
    { id: 1, title: "O Poderoso Chefão", year: "1972", rating: 9.2, posterUrl: "/placeholder.svg", genre: "Crime, Drama" },
    { id: 2, title: "Clube da Luta", year: "1999", rating: 8.8, posterUrl: "/placeholder.svg", genre: "Drama, Thriller" },
    { id: 3, title: "Interestelar", year: "2014", rating: 8.6, posterUrl: "/placeholder.svg", genre: "Ficção Científica" },
    { id: 4, title: "A Origem", year: "2010", rating: 8.8, posterUrl: "/placeholder.svg", genre: "Ação, Ficção" },
  ];

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
            className="flex-1"
          />
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Search;
