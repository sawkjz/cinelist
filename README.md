# CineList (CRUD de Filmes)

Aplicação full-stack para catalogar filmes, consumir dados do TMDB e gerenciar autenticação pelo Supabase. O repositório contém:
- `server/`: API em Spring Boot (porta 8081, banco H2 em memória)
- `client/`: Frontend em React + Vite (porta 5173)
- `supabase/functions/updateMovies`: Edge Function para sincronizar filmes em alta

## Pré-requisitos
- Git
- Java 17 ou superior + Maven 3.9.x (ou usar o Maven Wrapper incluso)
- Node.js 18+ com npm
- Supabase CLI (opcional, apenas se for publicar a Edge Function)
- Conta no TMDB para gerar o token usado pelo backend e pela Edge Function

## Passo-a-passo após clonar
1. Clone e acesse o projeto:
   ```bash
   git clone <URL-do-repo>
   cd trabalho-crud-2-bi
   ```
2. Configure as variáveis necessárias:
   - `server/src/main/resources/application.properties`: preencha `tmdb.api.key` com seu token TMDB.
   - `client/.env`: informe `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` do seu projeto Supabase.
3. Instale e execute o backend:
   ```bash
   cd server
   mvn clean install
   mvn spring-boot:run
   ```
   O backend ficará disponível em `http://localhost:8081` e já serve o banco H2 em memória.
4. Em outro terminal, instale e execute o frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   O frontend sobe em `http://localhost:5173` e consome a API local.
5. (Opcional) Faça o deploy da Edge Function que sincroniza os filmes do TMDB com a tabela `movies` do Supabase:
   ```bash
   cd supabase/functions
   supabase login
   supabase link --project-ref <seu-project-ref>
   supabase secrets set MOVIE_API_KEY=<tmdb_bearer_token>
   supabase functions deploy updateMovies
   ```
   Depois disso você pode invocar a função via CLI ou frontend para manter a tabela atualizada.

## Banco de reviews no Supabase
Para que os comentários feitos na tela de detalhes do filme fiquem salvos mesmo após reinstalar o projeto, crie a tabela abaixo no seu Supabase (SQL Editor):

```sql
create table if not exists public.movie_reviews (
  id bigserial primary key,
  user_id uuid not null,
  user_name text not null,
  user_avatar_url text,
  tmdb_id bigint not null,
  movie_title text not null,
  rating numeric(2,1) not null check (rating between 0 and 5),
  comment text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint movie_reviews_user_tmdb_unique unique (user_id, tmdb_id)
);
```

> Dica: restrinja o acesso a essa tabela para apenas usuários autenticados no Supabase Dashboard (Auth → Policies) para que cada review esteja atrelada a um login válido.

## Scripts úteis
- `./setup-mac-linux.sh` ou `setup-windows.bat`: instaladores automatizados das dependências e variáveis básicas (ajustar antes de rodar).
- `./start-all.bat`: inicia backend e frontend juntos no Windows.

Com esses comandos o projeto já roda localmente logo após o clone. Ajuste os arquivos de configuração conforme suas credenciais antes de compartilhar builds.
