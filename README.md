# CineList

Aplicação full-stack para catalogar filmes, consumir dados do TMDB e gerenciar autenticação pelo Supabase. O repositório contém:
- `server/`: API em Spring Boot (porta 8081, banco H2 em memória)
- `client/`: Frontend em React + Vite (porta 8080)
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
   - `VITE_SUPABASE_URL=`
   - `VITE_SUPABASE_PUBLISHABLE_KEY=`
3. Instale e execute o backend:
   ```
   cd server
   mvn clean install
   mvn spring-boot:run
   ```
4. Em outro terminal, instale e execute o frontend:
   ```
   cd client
   npm install
   npm run dev
   ```
5. (Opcional) Faça o deploy da Edge Function que sincroniza os filmes do TMDB com a tabela `movies` do Supabase:
   ```bash
   cd supabase/functions
   supabase login
   supabase link --project-ref <seu-project-ref>
   supabase secrets set MOVIE_API_KEY=<tmdb_bearer_token>
   supabase functions deploy updateMovies
   ```

## Scripts úteis
- `./setup-mac-linux.sh` ou `setup-windows.bat`: instaladores automatizados das dependências e variáveis básicas (ajustar antes de rodar).
- `./start-all.bat`: inicia backend e frontend juntos no Windows.
