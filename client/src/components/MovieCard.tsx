import { Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MovieCardProps {
  title: string;
  year: string;
  rating: number;
  posterUrl: string;
  genre: string;
}

const MovieCard = ({ title, year, rating, posterUrl, genre }: MovieCardProps) => {
  return (
    <Card className="group relative overflow-hidden bg-gradient-card border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-glow">
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
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
            <span className="text-xs font-medium text-accent">{rating}</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{genre}</span>
      </div>
    </Card>
  );
};

export default MovieCard;
