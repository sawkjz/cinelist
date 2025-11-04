# Sistema de Gerenciamento de Títulos

Sistema completo de CRUD para gerenciamento de títulos (filmes/séries) com autenticação, desenvolvido com React + TypeScript no frontend e Spring Boot no backend.

## 🚀 Tecnologias

### Frontend
- React 18
- TypeScript
- Axios
- React Router DOM
- Vite

### Backend
- Java 17
- Spring Boot 3.3.4
- Spring Data JPA
- H2 Database (em memória)
- Maven

## 📋 Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **Java JDK** (versão 17 ou superior)
- **Maven** (versão 3.6 ou superior)
- **Git**

## 🔧 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/sawkjz/trabalho-crud-2-bi.git
cd trabalho-crud-2-bi
```

### 2. Configurar e executar o Backend

```bash
# Navegue até a pasta do servidor
cd server

# Compile e execute o projeto (Maven irá baixar as dependências automaticamente)
mvn spring-boot:run
```

O backend estará rodando em: **http://localhost:8080**

**Console H2 Database:** http://localhost:8080/h2
- JDBC URL: `jdbc:h2:mem:filmes`
- Username: `sa`
- Password: (deixe em branco)

### 3. Configurar e executar o Frontend

Abra um **novo terminal** e execute:

```bash
# Navegue até a pasta do cliente (a partir da raiz do projeto)
cd client

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

O frontend estará rodando em: **http://localhost:5173**

## 📱 Como usar

1. Acesse http://localhost:5173
2. Na tela de login, clique em **"Entrar"** (não há validação)
3. Você será redirecionado para a página de títulos
4. Gerencie seus títulos (Criar, Editar, Excluir, Visualizar)

## 📁 Estrutura do Projeto

```
trabalho-crud-2-bi/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── modules/
│   │   │   ├── login/        # Módulo de autenticação
│   │   │   └── titulos/      # Módulo de títulos
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── lib/             # Configurações (API)
│   │   └── App.tsx          # Componente principal
│   └── package.json
│
└── server/                    # Backend Spring Boot
    ├── src/main/
    │   ├── java/
    │   │   ├── modules/
    │   │   │   ├── auth/     # Módulo de autenticação
    │   │   │   └── titulos/  # Módulo de títulos
    │   │   ├── config/       # Configurações (CORS)
    │   │   └── Application.java
    │   └── resources/
    │       └── application.properties
    └── pom.xml
```

## 🌐 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Realizar login

### Títulos
- `GET /api/titulos` - Listar todos os títulos
- `GET /api/titulos/{id}` - Obter título por ID
- `POST /api/titulos` - Criar novo título
- `PUT /api/titulos/{id}` - Atualizar título
- `DELETE /api/titulos/{id}` - Excluir título

## 📤 Como trabalhar com Git e GitHub

### Primeira vez - Subir projeto inicial

```bash
# Na raiz do projeto
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/sawkjz/trabalho-crud-2-bi.git
git push -u origin main
```

### Fluxo de trabalho com branches

#### 1. Clonar o projeto

```bash
git clone https://github.com/sawkjz/trabalho-crud-2-bi.git
cd trabalho-crud-2-bi
```

#### 2. Criar uma nova branch para desenvolver uma feature

```bash
# Criar e mudar para a nova branch
git checkout -b feature/nome-da-sua-feature

# Exemplos:
# git checkout -b feature/adicionar-filtros
# git checkout -b feature/melhorar-login
# git checkout -b fix/corrigir-bug-titulo
```

#### 3. Fazer alterações e commitar

```bash
# Verificar arquivos modificados
git status

# Adicionar arquivos específicos
git add arquivo1.ts arquivo2.tsx

# Ou adicionar todos os arquivos modificados
git add .

# Fazer commit com mensagem descritiva
git commit -m "feat: adiciona filtro de títulos por plataforma"

# Exemplos de mensagens de commit:
# git commit -m "feat: adiciona validação no formulário de login"
# git commit -m "fix: corrige erro ao deletar título"
# git commit -m "refactor: reorganiza estrutura de pastas"
# git commit -m "docs: atualiza README com instruções"
```

#### 4. Enviar branch para o GitHub

```bash
# Primeira vez enviando a branch
git push -u origin feature/nome-da-sua-feature

# Próximas vezes (após já ter feito o push -u)
git push
```

#### 5. Criar Pull Request (PR) no GitHub

1. Acesse: https://github.com/sawkjz/trabalho-crud-2-bi
2. Clique em **"Compare & pull request"**
3. Adicione título e descrição do que foi feito
4. Clique em **"Create pull request"**

#### 6. Fazer merge para produção (main)

**Opção A - Via GitHub (Recomendado):**
1. No Pull Request, clique em **"Merge pull request"**
2. Confirme o merge
3. Delete a branch após o merge (opcional)

**Opção B - Via terminal:**
```bash
# Voltar para a branch main
git checkout main

# Atualizar a branch main
git pull origin main

# Fazer merge da sua branch
git merge feature/nome-da-sua-feature

# Enviar para o GitHub
git push origin main

# Deletar a branch local (opcional)
git branch -d feature/nome-da-sua-feature

# Deletar a branch remota (opcional)
git push origin --delete feature/nome-da-sua-feature
```

#### 7. Atualizar sua branch local com as mudanças da main

```bash
# Ir para a branch main
git checkout main

# Baixar as atualizações
git pull origin main

# Voltar para sua branch de trabalho (se necessário)
git checkout feature/sua-branch

# Atualizar sua branch com as mudanças da main
git merge main
```

### Comandos úteis do Git

```bash
# Ver histórico de commits
git log

# Ver histórico resumido
git log --oneline

# Ver branches locais
git branch

# Ver todas as branches (locais e remotas)
git branch -a

# Mudar de branch
git checkout nome-da-branch

# Descartar alterações em um arquivo
git checkout -- nome-do-arquivo

# Descartar todas as alterações não commitadas
git reset --hard

# Ver diferenças do que foi modificado
git diff

# Ver status dos arquivos
git status
```

### Boas práticas

1. **Sempre trabalhe em branches** - Nunca desenvolva direto na `main`
2. **Commits frequentes** - Faça commits pequenos e frequentes
3. **Mensagens claras** - Use mensagens descritivas nos commits
4. **Pull antes de Push** - Sempre dê `git pull` antes de fazer `git push`
5. **Teste antes do merge** - Certifique-se que tudo funciona antes de fazer merge
6. **Delete branches antigas** - Após o merge, delete branches que não usa mais

### Criar arquivo .gitignore

Crie um arquivo `.gitignore` na raiz do projeto:

```
# Node
client/node_modules/
client/dist/
client/.vite/

# Java/Maven
server/target/
server/.mvn/
server/mvnw
server/mvnw.cmd

# IDEs
.idea/
.vscode/
*.iml
*.log

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
```

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.
