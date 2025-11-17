# 🚀 Guia de Setup do Projeto - CineList

Este guia mostra **exatamente** o que você precisa fazer toda vez que clonar o repositório.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **Java 17** ou superior
- **Maven** (opcional, o projeto tem Maven Wrapper)
- **Git**

### Como verificar se está instalado:

```powershell
# Windows PowerShell
node --version
java -version
mvn -version    # Opcional
git --version
```

---

## 🎯 Passo a Passo - Setup Completo

### 1️⃣ Clonar o Repositório

```powershell
git clone https://github.com/sawkjz/trabalho-crud-2-bi.git
cd trabalho-crud-2-bi
```

---

### 2️⃣ Configurar o Backend (Servidor Java)

```powershell
# Navegar para a pasta do servidor
cd server

# Instalar dependências e compilar (Maven faz isso automaticamente)
# Nada precisa ser instalado manualmente, o Maven Wrapper cuida disso!
```

**O backend está pronto!** ✅

---

### 3️⃣ Configurar o Frontend (React)

```powershell
# Voltar para a raiz do projeto
cd ..

# Navegar para a pasta do cliente
cd client

# Instalar as dependências do Node.js
npm install

# OU se você usa yarn
yarn install

# OU se você usa bun
bun install
```

**Aguarde a instalação terminar** (pode demorar alguns minutos na primeira vez).

---

### 4️⃣ Configurar Variáveis de Ambiente

Criar o arquivo `.env` na pasta `client`:

```powershell
# Ainda dentro da pasta client
# No Windows, você pode usar o comando:
New-Item .env -ItemType File
```

Abra o arquivo `.env` e adicione:

```env
# Supabase Local Development
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

> **Nota:** Se você tem um projeto Supabase em produção, substitua pelas suas credenciais reais.

---

### 5️⃣ Iniciar o Projeto

Você precisa rodar **2 servidores** em **2 terminais diferentes**:

#### Terminal 1 - Backend (Servidor Java)

```powershell
# Na raiz do projeto
cd server

# Iniciar o servidor backend
mvn spring-boot:run
```

Aguarde até ver a mensagem:
```
Started Application in X seconds
Tomcat started on port 8081
```

#### Terminal 2 - Frontend (React)

```powershell
# Na raiz do projeto
cd client

# Iniciar o servidor frontend
npm run dev
```

Aguarde até ver a mensagem:
```
VITE ready in XXX ms
Local: http://localhost:8080/
```

---

## 🌐 Acessar a Aplicação

Abra seu navegador e acesse:

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:8081
- **Console H2 (Banco de Dados):** http://localhost:8081/h2-console

### Credenciais do Console H2:
- **JDBC URL:** `jdbc:h2:mem:filmesdb`
- **Username:** `sa`
- **Password:** _(deixe em branco)_

---

## 📝 Resumo - Comandos Rápidos

### Setup Inicial (apenas na primeira vez):
```powershell
# 1. Clonar
git clone https://github.com/sawkjz/trabalho-crud-2-bi.git
cd trabalho-crud-2-bi

# 2. Instalar dependências do frontend
cd client
npm install

# 3. Criar arquivo .env (e configurar)
New-Item .env -ItemType File
```

### Iniciar o Projeto (toda vez):

**Terminal 1 - Backend:**
```powershell
cd trabalho-crud-2-bi/server
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```powershell
cd trabalho-crud-2-bi/client
npm run dev
```

---

## 🔧 Troubleshooting - Problemas Comuns

### ❌ Erro: "Port 8080 is already in use"

Algum processo está usando a porta 8080. Para matar o processo:

```powershell
# Encontrar o PID do processo na porta 8080
netstat -ano | findstr :8080

# Matar o processo (substitua <PID> pelo número encontrado)
taskkill /PID <PID> /F
```

### ❌ Erro: "Port 8081 is already in use"

Mesmo procedimento para a porta 8081:

```powershell
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### ❌ Tela branca no navegador

1. Verifique se o arquivo `.env` existe em `client/.env`
2. Verifique se ambos os servidores estão rodando
3. Abra o Console do Navegador (F12) e veja se há erros

### ❌ Erro: "JAVA_HOME is not defined"

Você precisa configurar a variável de ambiente JAVA_HOME:

```powershell
# Descobrir onde o Java está instalado
where java

# Configurar JAVA_HOME (exemplo)
setx JAVA_HOME "C:\Program Files\Java\jdk-17"
```

---

## 🎨 Estrutura do Projeto

```
trabalho-crud-2-bi/
├── client/                 # Frontend (React + Vite)
│   ├── src/               # Código fonte do React
│   ├── public/            # Arquivos estáticos
│   ├── package.json       # Dependências do Node
│   └── .env              # Variáveis de ambiente (criar)
│
├── server/                # Backend (Spring Boot)
│   ├── src/              # Código fonte Java
│   ├── pom.xml           # Dependências Maven
│   └── mvnw.cmd          # Maven Wrapper (Windows)
│
└── supabase/             # Configurações Supabase
    ├── functions/        # Edge Functions
    └── migrations/       # Migrações do banco
```

---

## 🚀 Dicas Extras

### Rodar em diferentes computadores (Mac/Windows):

**Windows:**
```powershell
cd server
mvn spring-boot:run
```

**Mac/Linux:**
```bash
cd server
chmod +x mvnw  # Primeira vez apenas
./mvnw spring-boot:run
```

### Comandos úteis:

```powershell
# Limpar e recompilar o backend
cd server
mvn clean install

# Atualizar dependências do frontend
cd client
npm install

# Build de produção do frontend
npm run build

# Ver logs detalhados do Maven
mvn spring-boot:run -X
```

---

## 📚 Tecnologias Utilizadas

### Frontend:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- React Router
- React Query
- Supabase Client

### Backend:
- Java 17
- Spring Boot 3.5.7
- Spring Data JPA
- H2 Database (em memória)
- Hibernate
- Maven

---

## 🆘 Precisa de Ajuda?

Se algo não funcionar:

1. Verifique se todos os pré-requisitos estão instalados
2. Certifique-se de estar na pasta correta
3. Leia as mensagens de erro com atenção
4. Confira o arquivo `.env` no frontend
5. Verifique se as portas 8080 e 8081 estão livres

---

**Boa sorte! 🎬🍿**
