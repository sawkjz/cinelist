import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Lista = Database['public']['Tables']['profile_movies_favlist']['Row'];
type ListaInsert = Database['public']['Tables']['profile_movies_favlist']['Insert'];
type ListaFilme = Database['public']['Tables']['profile_movies_favlist_movies']['Row'];
type ListaFilmeInsert = Database['public']['Tables']['profile_movies_favlist_movies']['Insert'];

export const LIST_STATUS = {
  WATCHING: "ASSISTINDO",
  FINISHED: "FINALIZADO",
  PLANNING: "PLANEJANDO_ASSISTIR",
  NEVER: "NUNCA_ASSISTIRIA",
} as const;

export class ListaSupabaseService {
  
  // Buscar todas as listas do usuário
  static async buscarListas(userId: string): Promise<Lista[]> {
    console.log("🔍 [SupabaseService] Buscando listas do usuário:", userId);
    
    const { data, error } = await supabase
      .from('profile_movies_favlist')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("❌ [SupabaseService] Erro ao buscar listas:", error);
      throw error;
    }
    
    console.log("✅ [SupabaseService] Listas encontradas:", data?.length);
    return data || [];
  }
  
  // Criar nova lista
  static async criarLista(userId: string, nome: string, status: ListaInsert["status"] = null): Promise<Lista> {
    console.log("➕ [SupabaseService] Criando lista:", nome);

    // Monta payload básico; status é opcional caso a coluna não exista no schema do usuário.
    const basePayload: Partial<ListaInsert> = { user_id: userId, list_name: nome };
    const payloadComStatus = status ? { ...basePayload, status } : basePayload;

    // Tenta criar com status; se falhar por qualquer motivo, tenta de novo sem status.
    const tentativa = await supabase
      .from('profile_movies_favlist')
      .insert(payloadComStatus)
      .select()
      .single();

    if (!tentativa.error && tentativa.data) {
      console.log("✅ [SupabaseService] Lista criada:", tentativa.data);
      return tentativa.data as Lista;
    }

    console.warn("⚠️ [SupabaseService] Falha na criação com status, tentando sem status.", tentativa.error);
    const fallback = await supabase
      .from('profile_movies_favlist')
      .insert(basePayload)
      .select()
      .single();

    if (fallback.error || !fallback.data) {
      console.error("❌ [SupabaseService] Erro ao criar lista (fallback):", fallback.error);
      throw fallback.error ?? new Error("Erro desconhecido ao criar lista");
    }

    console.log("✅ [SupabaseService] Lista criada (sem status):", fallback.data);
    return fallback.data as Lista;
  }
  
  // Adicionar filme à lista
  static async adicionarFilme(listaId: number, movieId: number): Promise<void> {
    console.log("🎬 [SupabaseService] Adicionando filme", movieId, "à lista", listaId);
    
    // Verificar se já existe
    const { data: existe } = await supabase
      .from('profile_movies_favlist_movies')
      .select('id')
      .eq('favlist_id', listaId)
      .eq('movie_id', movieId)
      .single();
    
    if (existe) {
      throw new Error("Filme já existe nesta lista");
    }
    
    const { error } = await supabase
      .from('profile_movies_favlist_movies')
      .insert({
        favlist_id: listaId,
        movie_id: movieId
      });
    
    if (error) {
      console.error("❌ [SupabaseService] Erro ao adicionar filme:", error);
      throw error;
    }
    
    console.log("✅ [SupabaseService] Filme adicionado com sucesso");
  }
  
  // Remover filme da lista
  static async removerFilme(listaId: number, movieId: number): Promise<void> {
    console.log("🗑️ [SupabaseService] Removendo filme", movieId, "da lista", listaId);
    
    const { error } = await supabase
      .from('profile_movies_favlist_movies')
      .delete()
      .eq('favlist_id', listaId)
      .eq('movie_id', movieId);
    
    if (error) {
      console.error("❌ [SupabaseService] Erro ao remover filme:", error);
      throw error;
    }
    
    console.log("✅ [SupabaseService] Filme removido com sucesso");
  }
  
  // Deletar lista
  static async deletarLista(listaId: number): Promise<void> {
    console.log("🗑️ [SupabaseService] Deletando lista ID:", listaId);
    
    const { error } = await supabase
      .from('profile_movies_favlist')
      .delete()
      .eq('id', listaId);
    
    if (error) {
      console.error("❌ [SupabaseService] Erro ao deletar lista:", error);
      throw error;
    }
    
    console.log("✅ [SupabaseService] Lista deletada com sucesso");
  }
  
  // Buscar filmes de uma lista
  static async buscarFilmesDaLista(listaId: number): Promise<number[]> {
    console.log("🔍 [SupabaseService] Buscando filmes da lista:", listaId);
    
    const { data, error } = await supabase
      .from('profile_movies_favlist_movies')
      .select('movie_id')
      .eq('favlist_id', listaId);
    
    if (error) {
      console.error("❌ [SupabaseService] Erro ao buscar filmes:", error);
      throw error;
    }
    
    const movieIds = data?.map(item => item.movie_id) || [];
    console.log("✅ [SupabaseService] Filmes encontrados:", movieIds.length);
    return movieIds;
  }
}
