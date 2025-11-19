-- =====================================================
-- SQL PARA CRIAR TABELAS NO SUPABASE
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- 1. Tabela de Usuários
CREATE TABLE IF NOT EXISTS public.usuarios (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  data_criacao TIMESTAMP DEFAULT NOW(),
  data_atualizacao TIMESTAMP DEFAULT NOW()
);

-- 2. Tabela de Listas
CREATE TABLE IF NOT EXISTS public.listas (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(500),
  usuario_id BIGINT NOT NULL,
  data_criacao TIMESTAMP DEFAULT NOW(),
  data_atualizacao TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 3. Tabela de Filmes nas Listas
CREATE TABLE IF NOT EXISTS public.lista_filmes (
  id BIGSERIAL PRIMARY KEY,
  lista_id BIGINT NOT NULL,
  tmdb_id BIGINT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  poster_path VARCHAR(255),
  ano_lancamento VARCHAR(255),
  nota DOUBLE PRECISION,
  generos VARCHAR(255),
  data_adicao TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (lista_id) REFERENCES listas(id) ON DELETE CASCADE
);

-- 4. Tabela de Filmes do Usuário (status: assistindo, completo, etc)
CREATE TABLE IF NOT EXISTS public.filmes_usuario (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL,
  tmdb_id BIGINT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  poster_path VARCHAR(255),
  ano_lancamento VARCHAR(255),
  nota_usuario DOUBLE PRECISION,
  generos VARCHAR(255),
  status VARCHAR(50) NOT NULL CHECK (status IN ('ASSISTINDO', 'COMPLETO', 'PLANEJADO', 'ABANDONADO')),
  data_adicao TIMESTAMP DEFAULT NOW(),
  data_atualizacao TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 5. Tabela de Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL,
  tmdb_id BIGINT NOT NULL,
  titulo_filme VARCHAR(255) NOT NULL,
  nota DOUBLE PRECISION NOT NULL,
  comentario TEXT,
  data_criacao TIMESTAMP DEFAULT NOW(),
  data_atualizacao TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Criar Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_listas_usuario_id ON listas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_lista_filmes_lista_id ON lista_filmes(lista_id);
CREATE INDEX IF NOT EXISTS idx_lista_filmes_tmdb_id ON lista_filmes(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_filmes_usuario_usuario_id ON filmes_usuario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_reviews_usuario_id ON reviews(usuario_id);

-- Inserir usuário de teste (ID = 1)
INSERT INTO public.usuarios (id, nome, email, senha, data_criacao, data_atualizacao)
VALUES (1, 'Demo User', 'demo@cinelist.com', '$2a$10$dummy', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Resetar sequência para começar do ID 2 (caso o usuário 1 já exista)
SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));

-- Verificar se as tabelas foram criadas
SELECT 
  table_name, 
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('usuarios', 'listas', 'lista_filmes', 'filmes_usuario', 'reviews')
ORDER BY table_name;
