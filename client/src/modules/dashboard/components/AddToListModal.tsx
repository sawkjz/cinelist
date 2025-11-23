import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, List } from "lucide-react";
import { toast } from "sonner";
import { ListaSupabaseService } from "@/services/ListaSupabaseService";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Lista = Database['public']['Tables']['profile_movies_favlist']['Row'];

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  year: string;
  rating: number;
  genre: string;
}

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
  usuarioId: number; // Este é o ID antigo do backend - não será mais usado
}

const AddToListModal = ({ isOpen, onClose, movie, usuarioId }: AddToListModalProps) => {
  const [listas, setListas] = useState<Lista[]>([]);
  const [mostrarFormNova, setMostrarFormNova] = useState(false);
  const [novaLista, setNovaLista] = useState({ nome: "" });
  const [loading, setLoading] = useState(false);
  const [adicionando, setAdicionando] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      console.log("📂 [AddToListModal] Modal aberto para o filme:", movie.title);
      carregarListas();
    }
  }, [isOpen, movie.title]);

  const carregarListas = async () => {
    console.log("🔄 [AddToListModal] Carregando listas do Supabase");
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      const listas = await ListaSupabaseService.buscarListas(user.id);
      console.log("✅ [AddToListModal] Listas carregadas:", listas);
      setListas(listas);
      
    } catch (error) {
      console.error("❌ [AddToListModal] Erro ao carregar listas:", error);
      toast.error("Erro ao carregar suas listas");
    }
  };

  const criarNovaLista = async () => {
    if (!novaLista.nome.trim()) {
      toast.error("Digite um nome para a lista");
      return;
    }

    console.log("➕ [AddToListModal] Criando nova lista no Supabase:", novaLista.nome);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      const listaCriada = await ListaSupabaseService.criarLista(user.id, novaLista.nome);
      console.log("✅ [AddToListModal] Lista criada com sucesso:", listaCriada);
      
      setListas([listaCriada, ...listas]);
      setNovaLista({ nome: "" });
      setMostrarFormNova(false);
      toast.success("Lista criada com sucesso!");
      
    } catch (error) {
      console.error("❌ [AddToListModal] Erro ao criar lista:", error);
      toast.error("Erro ao criar lista");
    } finally {
      setLoading(false);
    }
  };

  const adicionarFilmeNaLista = async (listaId: number) => {
    console.log("🎬 [AddToListModal] Adicionando filme", movie.title, "na lista ID:", listaId);
    setAdicionando(listaId);

    try {
      await ListaSupabaseService.adicionarFilme(listaId, movie.id);
      console.log("✅ [AddToListModal] Filme adicionado com sucesso no Supabase");
      toast.success("Filme adicionado à lista!");
      onClose();
      
    } catch (error: unknown) {
      console.error("❌ [AddToListModal] Erro ao adicionar filme:", error);
      const message = error instanceof Error ? error.message : "Erro ao adicionar filme";
      toast.error(message);
    } finally {
      setAdicionando(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Adicionar "{movie.title}" a uma lista
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Botão para criar nova lista */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setMostrarFormNova(!mostrarFormNova)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {mostrarFormNova ? "Cancelar" : "Criar Nova Lista"}
          </Button>

          {/* Formulário de nova lista */}
          {mostrarFormNova && (
            <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
              <Input
                placeholder="Nome da lista"
                value={novaLista.nome}
                onChange={(e) => setNovaLista({ nome: e.target.value })}
              />
              <Button onClick={criarNovaLista} disabled={loading} className="w-full">
                {loading ? "Criando..." : "Criar Lista"}
              </Button>
            </div>
          )}

          {/* Lista de listas existentes */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {listas.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Você ainda não tem listas. Crie uma nova!
              </p>
            ) : (
              listas.map((lista) => (
                <div
                  key={lista.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <h4 className="font-medium">{lista.list_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Lista criada
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => adicionarFilmeNaLista(lista.id)}
                    disabled={adicionando === lista.id}
                  >
                    {adicionando === lista.id ? "Adicionando..." : "Adicionar"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToListModal;
