import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import MovieCard from "../components/MovieCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Film } from "lucide-react";
import { toast } from "sonner";

interface Filme {
  id: number;
  tmdbId: number;
  titulo: string;
  posterPath: string;
  anoLancamento: string;
  nota: number;
  generos: string;
}

interface Lista {
  id: number;
  nome: string;
  descricao: string;
  totalFilmes: number;
  filmes: Filme[];
}

const MyListPage = () => {
  const [listas, setListas] = useState<Lista[]>([]);
  const [loading, setLoading] = useState(true);
  const usuarioId = 1; // TODO: Pegar do contexto de autenticação

  useEffect(() => {
    console.log("📂 [MyListPage] Carregando página Minha Lista");
    carregarListas();
  }, []);

  const carregarListas = async () => {
    console.log("🔄 [MyListPage] Buscando listas do usuário ID:", usuarioId);
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8081/api/listas/usuario/${usuarioId}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar listas");
      }

      const data = await response.json();
      console.log("✅ [MyListPage] Listas carregadas:", data);
      setListas(data);
    } catch (error) {
      console.error("❌ [MyListPage] Erro ao carregar listas:", error);
      toast.error("Erro ao carregar suas listas");
    } finally {
      setLoading(false);
    }
  };

  const removerFilme = async (listaId: number, tmdbId: number, titulo: string) => {
    console.log(`🗑️ [MyListPage] Removendo filme "${titulo}" da lista ID:`, listaId);

    try {
      const response = await fetch(
        `http://localhost:8081/api/listas/usuario/${usuarioId}/lista/${listaId}/filme/${tmdbId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Erro ao remover filme");
      }

      console.log("✅ [MyListPage] Filme removido com sucesso");
      toast.success(`"${titulo}" removido da lista`);
      carregarListas(); // Recarregar listas
    } catch (error) {
      console.error("❌ [MyListPage] Erro ao remover filme:", error);
      toast.error("Erro ao remover filme");
    }
  };

  const deletarLista = async (listaId: number, nome: string) => {
    console.log(`🗑️ [MyListPage] Deletando lista "${nome}" (ID: ${listaId})`);

    if (!confirm(`Tem certeza que deseja deletar a lista "${nome}"?`)) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/api/listas/usuario/${usuarioId}/lista/${listaId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar lista");
      }

      console.log("✅ [MyListPage] Lista deletada com sucesso");
      toast.success(`Lista "${nome}" deletada`);
      carregarListas(); // Recarregar listas
    } catch (error) {
      console.error("❌ [MyListPage] Erro ao deletar lista:", error);
      toast.error("Erro ao deletar lista");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando suas listas...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-cinzel font-bold text-foreground">Minhas Listas</h1>
          <Button onClick={carregarListas} variant="outline">
            Atualizar
          </Button>
        </div>

        {listas.length === 0 ? (
          <Card className="p-12 text-center">
            <Film className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Nenhuma lista criada ainda</h2>
            <p className="text-muted-foreground mb-6">
              Comece adicionando filmes às suas listas! Clique em "Adicionar" em qualquer filme no dashboard.
            </p>
          </Card>
        ) : (
          <div className="space-y-12">
            {listas.map((lista) => (
              <div key={lista.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-cinzel font-bold text-foreground flex items-center gap-2">
                      {lista.nome}
                      <span className="text-sm font-normal text-muted-foreground">
                        ({lista.totalFilmes} {lista.totalFilmes === 1 ? "filme" : "filmes"})
                      </span>
                    </h2>
                    {lista.descricao && (
                      <p className="text-muted-foreground mt-1">{lista.descricao}</p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deletarLista(lista.id, lista.nome)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Deletar Lista
                  </Button>
                </div>

                {lista.filmes.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Esta lista está vazia. Adicione filmes do dashboard!
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {lista.filmes.map((filme) => (
                      <div key={filme.id} className="relative group">
                        <MovieCard
                          id={filme.tmdbId}
                          title={filme.titulo}
                          year={filme.anoLancamento}
                          rating={filme.nota}
                          posterUrl={
                            filme.posterPath
                              ? `https://image.tmdb.org/t/p/w500${filme.posterPath}`
                              : "/placeholder.svg"
                          }
                          genre={filme.generos}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={() => removerFilme(lista.id, filme.tmdbId, filme.titulo)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyListPage;
