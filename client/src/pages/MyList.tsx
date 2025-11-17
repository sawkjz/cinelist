import Navbar from "@/components/Navbar";
import MovieCard from "@/modules/movies/components/MovieCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyList = () => {
  const movies = [
    { id: 1, title: "O Poderoso Chefão", year: "1972", rating: 9.2, posterUrl: "/placeholder.svg", genre: "Crime, Drama" },
    { id: 2, title: "Clube da Luta", year: "1999", rating: 8.8, posterUrl: "/placeholder.svg", genre: "Drama, Thriller" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-cinzel font-bold mb-8 text-foreground">
          Minha Lista
        </h1>

        <Tabs defaultValue="watching" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="watching">Assistindo</TabsTrigger>
            <TabsTrigger value="completed">Completo</TabsTrigger>
            <TabsTrigger value="plan">Plano</TabsTrigger>
            <TabsTrigger value="dropped">Abandonado</TabsTrigger>
          </TabsList>

          <TabsContent value="watching">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} {...movie} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <p className="text-muted-foreground text-center py-12">Nenhum filme completado ainda</p>
          </TabsContent>

          <TabsContent value="plan">
            <p className="text-muted-foreground text-center py-12">Nenhum filme planejado ainda</p>
          </TabsContent>

          <TabsContent value="dropped">
            <p className="text-muted-foreground text-center py-12">Nenhum filme abandonado</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MyList;
