-- Criar tabela movies para armazenar filmes sincronizados do TMDB
CREATE TABLE IF NOT EXISTS movies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id INT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  overview TEXT,
  poster_url TEXT,
  backdrop_url TEXT,
  release_date DATE,
  popularity FLOAT8,
  genres TEXT[],
  trending BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_movies_trending ON movies(trending) WHERE trending = true;
CREATE INDEX IF NOT EXISTS idx_movies_external_id ON movies(external_id);
CREATE INDEX IF NOT EXISTS idx_movies_popularity ON movies(popularity DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Permitir leitura pública de filmes"
  ON movies
  FOR SELECT
  USING (true);

-- Política para permitir inserção/atualização via service role (Edge Function)
CREATE POLICY "Permitir inserção via service role"
  ON movies
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização via service role"
  ON movies
  FOR UPDATE
  USING (true);

-- Comentários para documentação
COMMENT ON TABLE movies IS 'Tabela de filmes sincronizados do TMDB';
COMMENT ON COLUMN movies.external_id IS 'ID do filme no TMDB';
COMMENT ON COLUMN movies.trending IS 'Indica se o filme está em alta';
