import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import MovieCard from "../components/MovieCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Film } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ListaSupabaseService, LIST_STATUS } from "@/services/ListaSupabaseService";
import type { Database } from "@/integrations/supabase/types";
import { toFiveStarScale } from "@/utils/rating";

type ListaSupabase = Database['public']['Tables']['profile_movies_favlist']['Row'];

interface FilmeDetalhes {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: Array<{ id: number; name: string }>;
}

interface ListaComFilmes extends ListaSupabase {
  movieIds: number[];
  filmes: FilmeDetalhes[];
}

const statusOrder = [
  { key: LIST_STATUS.WATCHING, label: "Assistindo" },
  { key: LIST_STATUS.FINISHED, label: "Finalizado" },
  { key: LIST_STATUS.PLANNING, label: "Planejando assistir" },
  { key: LIST_STATUS.NEVER, label: "Nunca mais assistiria" },
  { key: "SEM_STATUS", label: "Sem status" },
];

const MyListPage = () => {
  const [listas, setListas] = useState<ListaComFilmes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("📂 [MyListPage] Carregando página Minha Lista");
    carregarListas();
  }, []);

  const carregarListas = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("❌ [MyListPage] Usuário não autenticado");
        toast.error("Usuário não autenticado");
        setLoading(false);
        return;
      }

      console.log("🔄 [MyListPage] Buscando listas do usuário:", user.id);
      
      const listasSupabase = await ListaSupabaseService.buscarListas(user.id);
      console.log("✅ [MyListPage] Listas do Supabase:", listasSupabase);

      // Para cada lista, buscar os IDs dos filmes
      const listasComFilmes = await Promise.all(
        listasSupabase.map(async (lista) => {
          const movieIds = await ListaSupabaseService.buscarFilmesDaLista(lista.id);
          
          // Buscar detalhes dos filmes através do backend Java
          const filmes = await Promise.all(
            movieIds.map(async (movieId) => {
              try {
                const response = await fetch(
                  `http://localhost:8081/api/filmes/${movieId}`
                );
                if (response.ok) {
                  return await response.json();
                }
              } catch (error) {
                console.error(`❌ Erro ao buscar filme ${movieId}:`, error);
              }
              return null;
            })
          );

          return {
            ...lista,
            movieIds,
            filmes: filmes.filter(Boolean) as FilmeDetalhes[]
          };
        })
      );

      console.log("✅ [MyListPage] Listas carregadas com filmes:", listasComFilmes);
      setListas(listasComFilmes);
    } catch (error) {
      console.error("❌ [MyListPage] Erro ao carregar listas:", error);
      toast.error("Erro ao carregar suas listas");
    } finally {
      setLoading(false);
    }
  };

  const removerFilme = async (listaId: number, movieId: number, titulo: string) => {
    console.log(`🗑️ [MyListPage] Removendo filme "${titulo}" da lista ID:`, listaId);

    try {
      await ListaSupabaseService.removerFilme(listaId, movieId);
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
      await ListaSupabaseService.deletarLista(listaId);
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
        <main className="container mx-auto px-4 pt-24 pb-6">
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

      <main className="container mx-auto px-4 pt-24 pb-6">
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
            {statusOrder.map((statusItem) => {
              const listasDoStatus = listas.filter(
                (lista) => (lista.status || "SEM_STATUS") === statusItem.key
              );
              if (listasDoStatus.length === 0) return null;

              return (
                <section key={statusItem.key} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      {statusItem.label}
                      <span className="text-sm text-muted-foreground">
                        ({listasDoStatus.reduce((acc, l) => acc + l.filmes.length, 0)} filmes)
                      </span>
                    </h2>
                  </div>

                  <div className="space-y-8">
                    {listasDoStatus.map((lista) => (
                      <div key={lista.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold flex items-center gap-2">
                              {lista.list_name}
                              <span className="text-sm font-normal text-muted-foreground">
                                ({lista.filmes.length} {lista.filmes.length === 1 ? "filme" : "filmes"})
                              </span>
                            </h3>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deletarLista(lista.id, lista.list_name)}
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
                                  id={filme.id}
                                  title={filme.title}
                                  year={filme.release_date?.split('-')[0] || ''}
                                  rating={toFiveStarScale(filme.vote_average)}
                                  posterUrl={
                                    filme.poster_path
                                      ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
                                      : "/placeholder.svg"
                                  }
                                  genre={filme.genres?.map(g => g.name).join(', ') || ''}
                                />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                  onClick={() => removerFilme(lista.id, filme.id, filme.title)}
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
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyListPage;
