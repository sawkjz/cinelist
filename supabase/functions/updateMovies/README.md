# Edge Function: updateMovies

Edge Function do Supabase para sincronizar filmes em alta do TMDB com a tabela `movies`.

## 📋 Pré-requisitos

1. **Tabela `movies` criada no Supabase** com estas colunas:
   - `id` (uuid, primary key)
   - `external_id` (int4, unique)
   - `title` (text)
   - `overview` (text)
   - `poster_url` (text)
   - `backdrop_url` (text)
   - `release_date` (date)
   - `popularity` (float8)
   - `genres` (text[])
   - `trending` (boolean)
   - `updated_at` (timestamptz)

2. **Variáveis de ambiente configuradas no Supabase:**
   - `SUPABASE_URL` - URL do projeto (já configurada automaticamente)
   - `SUPABASE_SERVICE_ROLE_KEY` - Service role key (já configurada automaticamente)
   - `MOVIE_API_KEY` - Bearer token da API do TMDB

## 🚀 Deploy

### 1. Instalar Supabase CLI

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Ou via npm
npm install -g supabase
```

### 2. Login no Supabase

```bash
supabase login
```

### 3. Link com seu projeto

```bash
supabase link --project-ref <seu-project-ref>
```

### 4. Configurar variável de ambiente MOVIE_API_KEY

```bash
# Via CLI
supabase secrets set MOVIE_API_KEY=eyJhbGciOiJIUzI1NiJ9...

# Ou via Dashboard: Settings > Edge Functions > Secrets
```

### 5. Deploy da função

```bash
cd supabase/functions
supabase functions deploy updateMovies
```

## 📡 Como usar

### Invocar manualmente

```bash
# Via CLI
supabase functions invoke updateMovies

# Via curl
curl -L -X POST 'https://<project-ref>.supabase.co/functions/v1/updateMovies' \
  -H 'Authorization: Bearer <anon-key>' \
  --data '{}'
```

### Invocar do frontend

```typescript
import { supabase } from "@/integrations/supabase/client";

const { data, error } = await supabase.functions.invoke('updateMovies', {
  body: {}
});

console.log(data); // { status: "OK", message: "Successfully synced 20 trending movies" }
```

### Agendar execução automática (via Database Webhook)

1. Vá em **Database > Functions** no Supabase Dashboard
2. Crie uma função SQL:

```sql
CREATE OR REPLACE FUNCTION trigger_update_movies()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://<project-ref>.supabase.co/functions/v1/updateMovies',
    headers := '{"Authorization": "Bearer <service-role-key>"}'::jsonb,
    body := '{}'::jsonb
  );
END;
$$;
```

3. Use com pg_cron para agendar:

```sql
-- Executar todo dia às 3h da manhã
SELECT cron.schedule(
  'update-trending-movies',
  '0 3 * * *',
  'SELECT trigger_update_movies()'
);
```

## 🔍 O que a função faz

1. Busca filmes em alta da semana no TMDB (`/trending/movie/week`)
2. Formata os dados:
   - Converte `genre_ids` para nomes em português
   - Monta URLs completas para posters e backdrops
   - Define `trending = true`
3. Faz **upsert** na tabela `movies`:
   - Se o filme já existe (`external_id` duplicado), atualiza
   - Se não existe, insere novo
4. Retorna quantidade de filmes sincronizados

## 🛠️ Troubleshooting

### Erro: "Missing environment variables"
Configure a variável `MOVIE_API_KEY`:
```bash
supabase secrets set MOVIE_API_KEY=seu_token_aqui
```

### Erro: "TMDB API error: 401"
O token da API está inválido. Obtenha um novo em https://www.themoviedb.org/settings/api

### Erro: "relation 'movies' does not exist"
Crie a tabela `movies` primeiro. SQL:

```sql
CREATE TABLE movies (
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

CREATE INDEX idx_movies_trending ON movies(trending) WHERE trending = true;
CREATE INDEX idx_movies_external_id ON movies(external_id);
```

## 📊 Logs

Ver logs da função:

```bash
# Tempo real
supabase functions logs updateMovies --follow

# Últimas execuções
supabase functions logs updateMovies --limit 50
```
