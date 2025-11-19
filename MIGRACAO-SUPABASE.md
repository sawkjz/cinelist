# 🔄 Guia de Migração: H2 → Supabase PostgreSQL

## ⚠️ Problema Identificado

Você está salvando dados no **H2 (banco em memória)** do Spring Boot, mas suas tabelas estão no **Supabase PostgreSQL**.

- ❌ H2: Dados perdidos ao reiniciar o servidor
- ✅ Supabase: Dados persistentes na nuvem

## 📋 Passos para Conectar ao Supabase

### 1️⃣ Obter Credenciais do Supabase

1. Acesse: https://supabase.com/dashboard
2. Abra seu projeto: `lwzsokvghmzfntzcxwqv`
3. Vá em: **Settings** → **Database**
4. Em **Connection String**, copie a **URI** (formato: `postgresql://postgres:[YOUR-PASSWORD]@db.lwzsokvghmzfntzcxwqv.supabase.co:5432/postgres`)
5. Anote a **senha do banco** (você definiu ao criar o projeto)

### 2️⃣ Configurar application-supabase.properties

Abra o arquivo:
```
server/src/main/resources/application-supabase.properties
```

Substitua esta linha:
```properties
spring.datasource.password=SUA_SENHA_AQUI
```

Pela sua senha real do Supabase.

### 3️⃣ Criar Tabelas no Supabase (SQL Editor)

Execute este SQL no Supabase SQL Editor para criar as tabelas necessárias:

```sql
-- Tabela de listas de filmes (já existe como profile_movies_favlist)
-- Não precisa criar, já está lá!

-- Tabela de filmes nas listas (já existe como profile_movies_favlist_movies)
-- Não precisa criar, já está lá!

-- Adicionar descrição à tabela de listas (opcional)
ALTER TABLE profile_movies_favlist 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Adicionar campos de auditoria (opcional)
ALTER TABLE profile_movies_favlist 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
```

### 4️⃣ Criar Tabela de Filmes com Metadados

Execute no Supabase SQL Editor:

```sql
-- Criar tabela para armazenar metadados dos filmes do TMDB
CREATE TABLE IF NOT EXISTS public.movie_metadata (
  id BIGSERIAL PRIMARY KEY,
  tmdb_id BIGINT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  poster_path TEXT,
  release_year TEXT,
  rating DOUBLE PRECISION,
  genres TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índice para busca rápida por TMDB ID
CREATE INDEX IF NOT EXISTS idx_movie_metadata_tmdb_id 
ON public.movie_metadata(tmdb_id);
```

### 5️⃣ Instalar Dependências do Maven

```bash
cd server
C:\Users\leona\apache-maven-3.9.11\bin\mvn.cmd clean install
```

### 6️⃣ Iniciar Backend com Supabase

**Opção A - Usando profile do Spring:**
```bash
cd server
C:\Users\leona\apache-maven-3.9.11\bin\mvn.cmd spring-boot:run -Dspring-boot.run.profiles=supabase
```

**Opção B - Substituir application.properties:**
- Renomeie `application.properties` para `application-h2.properties.bak`
- Renomeie `application-supabase.properties` para `application.properties`
- Execute: `mvn spring-boot:run`

## 🔍 Verificação

Após iniciar o backend, você deve ver nos logs:

```
HikariPool-1 - Added connection conn0: url=jdbc:postgresql://db.lwzsokvghmzfntzcxwqv.supabase.co:5432/postgres
```

Em vez de:
```
url=jdbc:h2:mem:filmesdb  ❌
```

## 🎯 Próximos Passos

1. ✅ Configure a senha no `application-supabase.properties`
2. ✅ Execute os SQLs no Supabase
3. ✅ Instale dependências: `mvn clean install`
4. ✅ Inicie com: `mvn spring-boot:run -Dspring-boot.run.profiles=supabase`
5. ✅ Teste adicionando um filme à lista
6. ✅ Verifique no Supabase Table Editor se os dados apareceram

## 🆘 Troubleshooting

### Erro: "password authentication failed"
- Verifique se a senha está correta no `application-supabase.properties`
- No Supabase Dashboard, vá em Settings > Database > Reset Database Password

### Erro: "relation does not exist"
- Execute os SQLs de criação de tabelas no Supabase SQL Editor

### Erro: "connection refused"
- Verifique se o IP está liberado no Supabase
- Settings > Database > Disable SSL (apenas para testes)

## 📝 Notas Importantes

- **H2 vs PostgreSQL**: As tabelas têm estruturas ligeiramente diferentes
- **UUID vs BIGINT**: Supabase usa UUID para user_id
- **Schema**: Todas as tabelas devem estar no schema `public`
- **Connection Pooling**: Supabase tem limite de conexões (configure no application.properties)
