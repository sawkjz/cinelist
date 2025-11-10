# Configuração do Supabase - INSTRUÇÕES

## Problema Atual
O erro "supabaseUrl is required" indica que as variáveis de ambiente do Supabase não estão configuradas.

## Soluções Disponíveis

### Opção 1: Usar Supabase Local (Recomendado para desenvolvimento)

1. **Instalar Docker Desktop:**
   - Baixe e instale: https://www.docker.com/products/docker-desktop/
   - Execute o Docker Desktop

2. **Iniciar Supabase Local:**
   ```bash
   npx supabase start
   ```

3. **Atualizar .env.local com credenciais locais:**
   ```env
   VITE_SUPABASE_URL=http://127.0.0.1:54321
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
   ```

### Opção 2: Usar Supabase em Nuvem

1. **Acessar o Dashboard do Supabase:**
   - Vá para: https://supabase.com/dashboard/project/fkpvbhoaavhkmlkifmwm/settings/api

2. **Copiar as Credenciais:**
   - URL: Copie a "Project URL"
   - Key: Copie a "anon public" key

3. **Atualizar .env.local:**
   ```env
   VITE_SUPABASE_URL=sua_url_aqui
   VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_aqui
   ```

## Após Configurar

1. **Reiniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **O aplicativo deve abrir em:** http://localhost:8080

## Arquivos Criados/Modificados
- `.env.local` - Variáveis de ambiente do Supabase
- `SUPABASE_SETUP.md` - Este arquivo de instruções