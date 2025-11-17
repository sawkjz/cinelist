import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Film } from "lucide-react";

const Categories = () => {
  const navigate = useNavigate();

  const genres = [
    { id: 28, name: "Ação", color: "from-red-900 to-red-700", icon: "💥" },
    { id: 12, name: "Aventura", color: "from-green-900 to-green-700", icon: "🗺️" },
    { id: 16, name: "Animação", color: "from-pink-900 to-pink-700", icon: "🎨" },
    { id: 35, name: "Comédia", color: "from-yellow-900 to-yellow-700", icon: "😂" },
    { id: 80, name: "Crime", color: "from-gray-900 to-gray-700", icon: "🕵️" },
    { id: 99, name: "Documentário", color: "from-teal-900 to-teal-700", icon: "📽️" },
    { id: 18, name: "Drama", color: "from-purple-900 to-purple-700", icon: "🎭" },
    { id: 10751, name: "Família", color: "from-blue-900 to-blue-700", icon: "👨‍👩‍👧‍👦" },
    { id: 14, name: "Fantasia", color: "from-violet-900 to-violet-700", icon: "✨" },
    { id: 36, name: "História", color: "from-amber-900 to-amber-700", icon: "📚" },
    { id: 27, name: "Terror", color: "from-red-950 to-red-900", icon: "👻" },
    { id: 10402, name: "Música", color: "from-fuchsia-900 to-fuchsia-700", icon: "🎵" },
    { id: 9648, name: "Mistério", color: "from-indigo-900 to-indigo-700", icon: "🔍" },
    { id: 10749, name: "Romance", color: "from-rose-900 to-rose-700", icon: "💕" },
    { id: 878, name: "Ficção Científica", color: "from-cyan-900 to-cyan-700", icon: "🚀" },
    { id: 53, name: "Thriller", color: "from-slate-900 to-slate-700", icon: "😱" },
    { id: 10752, name: "Guerra", color: "from-stone-900 to-stone-700", icon: "⚔️" },
    { id: 37, name: "Faroeste", color: "from-orange-900 to-orange-700", icon: "🤠" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-cinzel font-bold mb-2 text-foreground">
          Explorar por Categoria
        </h1>
        <p className="text-muted-foreground mb-8">
          Descubra filmes organizados por gênero
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {genres.map((genre) => (
            <Card
              key={genre.id}
              className="overflow-hidden cursor-pointer hover:shadow-glow transition-all group"
              onClick={() => navigate(`/genre/${genre.id}`)}
            >
              <div
                className={`h-32 bg-gradient-to-br ${genre.color} flex flex-col items-center justify-center gap-2`}
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">
                  {genre.icon}
                </span>
                <Film className="h-6 w-6 text-white opacity-30 group-hover:opacity-60 transition-opacity" />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-sm">{genre.name}</h3>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Categories;
