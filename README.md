# 🎬 CineList - Sistema de Gerenciamento de Filmes

Sistema completo para gerenciar filmes, criar listas personalizadas, avaliar e acompanhar seu progresso cinematográfico.

## 📋 Índice

- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

## 🚀 Tecnologias

### Backend
- **Java 21** (ou Java 17+)
- **Spring Boot 3.5.7**
- **Spring Data JPA** (Hibernate)
- **H2 Database** (em memória)
- **Maven 3.9.11**
- **Lombok**

### Frontend
- **React 18.3.1**
- **TypeScript 5.8.3**
- **Vite 5.4.19**
- **React Router DOM**
- **Tailwind CSS**
- **Shadcn/ui** (componentes)
- **Supabase** (autenticação)
- **Sonner** (notificações toast)

### APIs Externas
- **TMDB API** (The Movie Database)
- **Supabase Functions**

## 📦 Pré-requisitos

### Obrigatórios
1. **Java JDK 21** (ou 17+)
   - Download: https://www.oracle.com/java/technologies/downloads/
   - Verificar: `java -version`

2. **Maven 3.9.11**
   - Download: https://maven.apache.org/download.cgi
   - Adicionar ao PATH do sistema
   - Verificar: `mvn -version`

3. **Node.js 18+** (com npm)
   - Download: https://nodejs.org/
   - Verificar: `node -version` e `npm -version`

### Opcional
- **Git** para clonar o repositório
- **VS Code** com extensões Java e React

## 🔧 Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/sawkjz/trabalho-crud-2-bi.git
cd trabalho-crud-2-bi
```

### 2. Instale Dependências do Backend
```bash
cd server
mvn clean install
```

### 3. Instale Dependências do Frontend
```bash
cd ../client
npm install
```

## ⚙️ Configuração

### Backend (server/src/main/resources/application.properties)

```properties
# Servidor
spring.application.name=api
server.port=8081

# Banco de Dados H2 (em memória)
spring.datasource.url=jdbc:h2:mem:filmesdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# Console H2 (opcional - para visualizar banco)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# TMDB API
tmdb.api.key=SUA_CHAVE_TMDB_AQUI
tmdb.api.base-url=https://api.themoviedb.org/3

# CORS (já configurado no código)
app.cors.allowed-origin=http://localhost:5173
```

**⚠️ IMPORTANTE: Obtenha sua chave TMDB:**
1. Acesse: https://www.themoviedb.org/
2. Crie uma conta gratuita
3. Vá em: Configurações → API → Solicitar Chave API
4. Copie a chave e cole em `tmdb.api.key`

### Frontend (client/.env)

Crie o arquivo `.env` na pasta `client/`:

```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
```

**⚠️ IMPORTANTE: Configure o Supabase:**
1. Acesse: https://supabase.com/
2. Crie um projeto gratuito
3. Copie a URL e Anon Key do projeto
4. Cole no arquivo `.env`

## 🚀 Executando o Projeto

### Opção 1: Usando Scripts Automatizados

#### Windows
```bash
# Inicie ambos os servidores de uma vez
start-all.bat
```

#### Mac/Linux
```bash
# Dê permissão de execução (primeira vez)
chmod +x setup-mac-linux.sh

# Inicie ambos os servidores
./setup-mac-linux.sh
```

### Opção 2: Manualmente

#### 1. Inicie o Backend
Abra um terminal na pasta `server/`:

```bash
# Com Maven no PATH
mvn spring-boot:run

# Ou com caminho completo do Maven
C:\caminho\para\apache-maven-3.9.11\bin\mvn.cmd spring-boot:run
```

**Servidor rodando em: http://localhost:8081**

#### 2. Inicie o Frontend
Abra outro terminal na pasta `client/`:

```bash
npm run dev
```

**Aplicação rodando em: http://localhost:5173** (ou 8080)

### 3. Acesse a Aplicação

Abra o navegador em: **http://localhost:5173**

**Credenciais Demo:**
- Email: `demo@cinelist.com`
- Senha: `demo123`

## 📁 Estrutura do Projeto

```
trabalho-crud-2-bi/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── components/              # Componentes compartilhados
│   │   │   ├── ui/                  # Componentes Shadcn/ui
│   │   │   ├── MovieCard.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── modules/                 # Módulos organizados por feature
│   │   │   ├── auth/                # Autenticação
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   └── index.tsx
│   │   │   ├── dashboard/           # Dashboard e Listas
│   │   │   │   ├── components/
│   │   │   │   │   ├── AddToListModal.tsx
│   │   │   │   │   ├── HeroSection.tsx
│   │   │   │   │   └── ...
│   │   │   │   └── index.tsx
│   │   │   ├── movies/              # Gerenciamento de filmes
│   │   │   ├── profile/             # Perfil do usuário
│   │   │   └── calendar/            # Calendário
│   │   ├── integrations/            # Integrações (Supabase)
│   │   ├── hooks/                   # Hooks customizados
│   │   ├── lib/                     # Utilitários
│   │   └── App.tsx                  # Componente principal
│   ├── package.json
│   └── vite.config.ts
│
├── server/                          # Backend Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/com/filmesapi/
│   │       │   ├── Application.java # Classe principal
│   │       │   ├── config/          # Configurações
│   │       │   │   └── WebConfig.java  # CORS
│   │       │   └── modules/         # Módulos por feature
│   │       │       ├── auth/        # Autenticação
│   │       │       │   ├── model/Usuario.java
│   │       │       │   └── repository/
│   │       │       ├── dashboard/   # Listas de filmes
│   │       │       │   ├── controller/ListaController.java
│   │       │       │   ├── service/ListaService.java
│   │       │       │   ├── repository/
│   │       │       │   ├── model/
│   │       │       │   │   ├── Lista.java
│   │       │       │   │   └── ListaFilme.java
│   │       │       │   └── dto/
│   │       │       └── filmes/      # Integração TMDB
│   │       │           ├── controller/FilmeController.java
│   │       │           ├── service/TMDBService.java
│   │       │           ├── repository/
│   │       │           └── model/
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── supabase/                        # Funções serverless
│   └── functions/
│       └── updateMovies/
│
├── README.md                        # Este arquivo
└── start-all.bat                    # Script de inicialização
```

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com email/senha
- Cadastro de novos usuários
- Credenciais demo para testes
- Proteção de rotas privadas

### 🎬 Filmes
- **Busca de filmes** via TMDB API
- **Filmes populares** atualizados
- **Filmes em cartaz**
- **Trending** (em alta)
- **Detalhes do filme** (nota, ano, gênero, sinopse)
- **Adicionar à lista pessoal**

### 📋 Listas Personalizadas
- **Criar listas** com nome e descrição
- **Adicionar filmes** às listas
- **Remover filmes** das listas
- **Deletar listas** completas
- **Visualizar** todas as suas listas
- Contador de filmes por lista

### 🏠 Dashboard
- Seção "Filmes em Cartaz"
- Seção "Em Alta Agora"
- Seção "Populares"
- Seção "Continue Assistindo"
- Notificações de atividades
- Hero section com call-to-action

### 👤 Perfil
- Visualizar informações do usuário
- Editar dados pessoais
- Histórico de atividades

## 🔌 API Endpoints

### Filmes (TMD)

```
GET  /api/filmes/popular?page=1          # Filmes populares
GET  /api/filmes/now-playing?page=1      # Filmes em cartaz
GET  /api/filmes/trending?page=1         # Filmes em alta
GET  /api/filmes/search?query=batman     # Buscar filmes
GET  /api/filmes/{id}                    # Detalhes do filme
```

### Listas de Filmes

```
GET    /api/listas/usuario/{usuarioId}   # Buscar listas do usuário
POST   /api/listas/usuario/{usuarioId}   # Criar nova lista
DELETE /api/listas/lista/{listaId}       # Deletar lista

POST   /api/listas/usuario/{usuarioId}/adicionar-filme  # Adicionar filme
DELETE /api/listas/lista/{listaId}/filme/{tmdbId}       # Remover filme
```

### Exemplo de Request (Criar Lista)

```json
POST http://localhost:8081/api/listas/usuario/1
Content-Type: application/json

{
  "nome": "Melhores Filmes de 2024",
  "descricao": "Minha seleção pessoal"
}
```

### Exemplo de Request (Adicionar Filme)

```json
POST http://localhost:8081/api/listas/usuario/1/adicionar-filme
Content-Type: application/json

{
  "listaId": 1,
  "tmdbId": 550,
  "titulo": "Fight Club",
  "posterPath": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  "anoLancamento": "1999",
  "nota": 8.4,
  "generos": "Drama, Thriller"
}
```

## 🐛 Troubleshooting

### Problema: Maven não encontrado

**Erro:** `mvn não é reconhecido como comando`

**Solução:**
1. Baixe Maven 3.9.11: https://maven.apache.org/download.cgi
2. Extraia para `C:\apache-maven-3.9.11`
3. Adicione ao PATH:
   - Abra "Variáveis de Ambiente"
   - Edite "Path" do sistema
   - Adicione: `C:\apache-maven-3.9.11\bin`
4. Reinicie o terminal
5. Teste: `mvn -version`

### Problema: Erro CORS no navegador

**Erro:** `Access to fetch at 'http://localhost:8081' has been blocked by CORS policy`

**Solução:**
1. Verifique se o backend está rodando na porta 8081
2. Confirme que `WebConfig.java` tem:
   ```java
   .allowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*")
   ```
3. Reinicie o servidor com: `mvn clean spring-boot:run`

### Problema: Banco de dados não cria tabelas

**Erro:** Tabelas não existem ao fazer requisições

**Solução:**
1. Verifique `application.properties`:
   ```properties
   spring.jpa.hibernate.ddl-auto=create-drop
   ```
2. Confira os logs do Spring Boot ao iniciar
3. Acesse H2 Console: http://localhost:8081/h2-console
   - JDBC URL: `jdbc:h2:mem:filmesdb`
   - User: `sa`
   - Password: *(vazio)*

### Problema: TMDB API retorna erro 401

**Erro:** `Unauthorized` ao buscar filmes

**Solução:**
1. Verifique sua chave TMDB em `application.properties`
2. Confirme que a chave está ativa no painel TMDB
3. Teste a chave diretamente: 
   ```
   https://api.themoviedb.org/3/movie/popular?api_key=SUA_CHAVE
   ```

### Problema: Frontend não conecta com backend

**Erro:** `ERR_CONNECTION_REFUSED`

**Solução:**
1. Confirme que o backend está rodando: http://localhost:8081
2. Verifique os logs do Spring Boot
3. Teste endpoint direto: http://localhost:8081/api/filmes/popular?page=1
4. Verifique firewall/antivírus bloqueando porta 8081

### Problema: npm install falha

**Erro:** Dependências não instalam

**Solução:**
```bash
# Limpe cache do npm
npm cache clean --force

# Delete node_modules e package-lock.json
rm -rf node_modules package-lock.json

# Reinstale
npm install
```

### Problema: Porta já em uso

**Erro:** `Port 8081 already in use`

**Solução Windows:**
```bash
# Encontre processo na porta
netstat -ano | findstr :8081

# Mate o processo (substitua PID)
taskkill /PID <PID> /F
```

**Solução Mac/Linux:**
```bash
# Encontre e mate processo
lsof -ti:8081 | xargs kill -9
```

## 📝 Notas Importantes

### Banco de Dados H2
- **Em memória**: Dados são perdidos ao reiniciar o servidor
- **Console H2**: http://localhost:8081/h2-console
- Para persistir dados, altere para H2 em arquivo:
  ```properties
  spring.datasource.url=jdbc:h2:file:./data/filmesdb
  ```

### Autenticação
- Por padrão, usuário ID=1 está hardcoded
- Para produção, integre com Supabase Auth completo
- Credenciais demo funcionam apenas para testes

### TMDB API
- Limite de 1000 requisições por dia (conta gratuita)
- Cache recomendado para produção
- Imagens via: `https://image.tmdb.org/t/p/w500{posterPath}`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Desenvolvedor Principal** - [sawkjz](https://github.com/sawkjz)

## 📞 Suporte

- **Issues:** https://github.com/sawkjz/trabalho-crud-2-bi/issues
- **Email:** seu-email@exemplo.com

---

**Desenvolvido com ❤️ usando Spring Boot + React**
