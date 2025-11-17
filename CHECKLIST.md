# ✅ Checklist - Setup do Projeto

Use este checklist toda vez que clonar o repositório em uma nova máquina.

## 📦 Primeira Vez (Setup Inicial)

- [ ] **1. Clonar o repositório**
  ```bash
  git clone https://github.com/sawkjz/trabalho-crud-2-bi.git
  cd trabalho-crud-2-bi
  ```

- [ ] **2. Instalar dependências do frontend**
  ```bash
  cd client
  npm install
  ```

- [ ] **3. Criar arquivo .env**
  ```bash
  # Windows
  copy .env.example .env
  
  # Mac/Linux
  cp .env.example .env
  ```

- [ ] **4. Configurar .env com credenciais Supabase**
  - Abrir `client/.env`
  - Adicionar URL e chave do Supabase

- [ ] **5. (Mac/Linux apenas) Dar permissão ao mvnw**
  ```bash
  chmod +x server/mvnw
  ```

## 🚀 Toda Vez (Iniciar Projeto)

### ⚙️ Pré-checklist
- [ ] Portas 8080 e 8081 estão livres
- [ ] Java está instalado (`java -version`)
- [ ] Node está instalado (`node -version`)

### 🎯 Iniciar Servidores

**Opção A: Manual (recomendado para desenvolvimento)**

- [ ] **Terminal 1: Iniciar Backend**
  ```bash
  cd server
  mvn spring-boot:run
  ```
  Aguardar mensagem: `Started Application in X seconds`

- [ ] **Terminal 2: Iniciar Frontend**
  ```bash
  cd client
  npm run dev
  ```
  Aguardar mensagem: `VITE ready`

**Opção B: Automático (Windows)**

- [ ] **Executar script**
  ```bash
  .\start-all.bat
  ```

### ✅ Verificação Final

- [ ] Backend rodando: http://localhost:8081
- [ ] Frontend rodando: http://localhost:8080
- [ ] Página carrega sem erros
- [ ] Console do navegador (F12) sem erros

## 🔍 Verificação de Problemas

Se algo não funcionar, verifique:

- [ ] Arquivo `.env` existe em `client/.env`
- [ ] Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY estão configuradas
- [ ] Nenhum outro processo usando portas 8080 ou 8081
- [ ] Terminal do backend mostra "Started Application"
- [ ] Terminal do frontend mostra "VITE ready"

## 📊 Status dos Serviços

Use estes comandos para verificar:

```bash
# Verificar se as portas estão em uso
netstat -ano | findstr :8080
netstat -ano | findstr :8081

# Ver processos Node
tasklist | findstr node

# Ver processos Java
tasklist | findstr java
```

## 🛑 Parar os Servidores

- **Ctrl + C** em cada terminal
- Ou feche as janelas dos terminais

## 🔄 Atualizar o Projeto

Depois de fazer `git pull`:

- [ ] **Atualizar dependências do frontend**
  ```bash
  cd client
  npm install
  ```

- [ ] **Recompilar backend (se houver mudanças)**
  ```bash
  cd server
  mvn clean install
  ```

---

**Dica:** Salve este arquivo como favorito ou imprima para consulta rápida! 📌
