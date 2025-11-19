import { useState } from "react";
import { Star, Plus, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AddToListModal from "@/modules/dashboard/components/AddToListModal";

interface MovieCardProps {
  id: number;
  title: string;
  year: string;
  rating: number;
  posterUrl: string;
  genre: string;
}

const MovieCard = ({ id, title, year, rating, posterUrl, genre }: MovieCardProps) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleAddToList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("➕ [MovieCard] Abrindo modal para adicionar filme:", title);
    setShowModal(true);
  };

  const handleViewInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/movie/${id}`);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevenir navegação se clicar dentro do modal
    if (showModal) {
      e.stopPropagation();
      return;
    }
    navigate(`/movie/${id}`);
  };

  return (
    <>
    <Card 
      className="group relative overflow-hidden bg-gradient-card border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-glow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleViewInfo}
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent transition-colors"
            >
              <Info className="h-4 w-4 mr-1" />
              Ver Info
            </Button>
            <Button 
              size="sm"
              onClick={handleAddToList}
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate text-foreground">{title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">{year}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span className="text-xs font-medium text-accent">{rating.toFixed(1)}</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground truncate block">{genre}</span>
      </div>
    </Card>
    {/* Modal de Adicionar às Listas - FORA do Card para evitar propagação de eventos */}
    {showModal && (
      <AddToListModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        movie={{ id, title, posterUrl, year, rating, genre }}
        usuarioId={1} // TODO: Pegar do contexto de autenticação
      />
    )}
    </>
  );
};

export default MovieCard;
