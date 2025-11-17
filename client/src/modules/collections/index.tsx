import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Film } from "lucide-react";

const Collections = () => {
  const collections = [
    { id: 1, name: "Favoritos de Terror", count: 23, color: "from-red-900 to-red-700" },
    { id: 2, name: "Clássicos do Cinema", count: 45, color: "from-amber-900 to-amber-700" },
    { id: 3, name: "Ficção Científica", count: 31, color: "from-blue-900 to-blue-700" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-cinzel font-bold text-foreground">
            Minhas Coleções
          </h1>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
            <Plus className="h-4 w-4" />
            Nova Coleção
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Card 
              key={collection.id} 
              className="overflow-hidden cursor-pointer hover:shadow-glow transition-all group"
            >
              <div className={`h-32 bg-gradient-to-br ${collection.color} flex items-center justify-center`}>
                <Film className="h-12 w-12 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{collection.name}</h3>
                <p className="text-sm text-muted-foreground">{collection.count} filmes</p>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Collections;
