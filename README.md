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

## 📤 Como subir no GitHub

### Primeira vez (projeto novo)

```bash
# Na raiz do projeto
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/sawkjz/trabalho-crud-2-bi.git
git push -u origin main
```

### Atualizações futuras

```bash
# Adicione as alterações
git add .

# Faça o commit com uma mensagem descritiva
git commit -m "Descrição das alterações"

# Envie para o GitHub
git push
```

### Criar arquivo .gitignore

Crie um arquivo `.gitignore` na raiz do projeto com o seguinte conteúdo:

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
```

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.
