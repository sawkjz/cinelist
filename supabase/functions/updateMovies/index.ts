// @ts-nocheck
// Supabase Edge Function - Os erros do TypeScript abaixo são normais
// Esta função roda no ambiente Deno do Supabase, não no Node.js
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  popularity: number;
  genre_ids: number[];
}

interface TMDBResponse {
  results: TMDBMovie[];
}

// Mapeamento de genre_ids para nomes de gêneros
const genreMap: Record<number, string> = {
  28: "Ação",
  12: "Aventura",
  16: "Animação",
  35: "Comédia",
  80: "Crime",
  99: "Documentário",
  18: "Drama",
  10751: "Família",
  14: "Fantasia",
  36: "História",
  27: "Terror",
  10402: "Música",
  9648: "Mistério",
  10749: "Romance",
  878: "Ficção Científica",
  53: "Thriller",
  10752: "Guerra",
  37: "Faroeste",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Ler variáveis de ambiente
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const movieApiKey = Deno.env.get("MOVIE_API_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey || !movieApiKey) {
      throw new Error("Missing environment variables");
    }

    // Criar cliente Supabase com service role key
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Buscar filmes em alta do TMDB
    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?language=pt-BR`,
      {
        headers: {
          Authorization: `Bearer ${movieApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!tmdbResponse.ok) {
      throw new Error(`TMDB API error: ${tmdbResponse.status}`);
    }

    const tmdbData: TMDBResponse = await tmdbResponse.json();

    // Formatar filmes para inserção no banco
    const movies = tmdbData.results.map((movie) => {
      // Mapear genre_ids para nomes de gêneros
      const genres = movie.genre_ids
        .map((id) => genreMap[id])
        .filter((genre) => genre !== undefined);

      return {
        external_id: movie.id,
        title: movie.title,
        overview: movie.overview || "",
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
        backdrop_url: movie.backdrop_path
          ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
          : null,
        release_date: movie.release_date || null,
        popularity: movie.popularity,
        genres: genres,
        trending: true,
        updated_at: new Date().toISOString(),
      };
    });

    // Fazer upsert na tabela movies
    const { data, error } = await supabase
      .from("movies")
      .upsert(movies, {
        onConflict: "external_id",
        ignoreDuplicates: false,
      });

    if (error) {
      console.error("Supabase upsert error:", error);
      throw error;
    }

    console.log(`Successfully updated ${movies.length} movies`);

    return new Response(
      JSON.stringify({
        status: "OK",
        message: `Successfully synced ${movies.length} trending movies`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in updateMovies function:", error);
    
    return new Response(
      JSON.stringify({
        status: "ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
