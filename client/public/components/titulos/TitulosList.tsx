import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Clapperboard, Star, Tv } from "lucide-react";
import { Titulo } from "@/pages/Titulos";
import { Badge } from "@/components/ui/badge";

interface TitulosListProps {
  titulos: Titulo[];
  isLoading: boolean;
  onEdit: (titulo: Titulo) => void;
  onDelete: (titulo: Titulo) => void;
}

const getStatusLabel = (status: Titulo["status"]) => {
  switch (status) {
    case "ASSISTINDO":
      return <Badge variant="default">Assistindo</Badge>;
    case "CONCLUIDO":
      return <Badge variant="secondary">Concluído</Badge>;
    case "QUERO_VER":
      return <Badge variant="outline">Quero Ver</Badge>;
    default:
      return null;
  }
};

export const TitulosList = ({ titulos, isLoading, onEdit, onDelete }: TitulosListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (titulos.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <Clapperboard className="h-16 w-16 text-muted-foreground" />
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum título cadastrado
            </h3>
            <p className="text-muted-foreground">
              Clique em "Novo Título" para começar
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {titulos.map((titulo) => (
        <Card
          key={titulo.id}
          className="p-5 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground break-words pr-2">
                {titulo.nome}
              </h3>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit(titulo)}
                  className="hover:bg-primary/10 hover:text-primary h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(titulo)}
                  className="hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mb-4">
              {getStatusLabel(titulo.status)}
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            {titulo.plataforma && (
              <div className="flex items-center gap-2">
                <Tv className="h-4 w-4" />
                <span>{titulo.plataforma}</span>
              </div>
            )}
            {titulo.avaliacao != null && titulo.avaliacao > 0 && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span>{titulo.avaliacao} / 10</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
