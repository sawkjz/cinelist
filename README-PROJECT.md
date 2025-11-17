# 🎬 CineList - Sua Lista de Filmes

Aplicação web para organizar, descobrir e compartilhar sua paixão por filmes.

## 🚀 Quick Start

### Primeira vez clonando o projeto?

**Windows:**
```powershell
# Execute o script de setup
.\setup-windows.bat
```

**Mac/Linux:**
```bash
# Dê permissão e execute o script de setup
chmod +x setup-mac-linux.sh
./setup-mac-linux.sh
```

**Ou faça manualmente:**

1. Instalar dependências do frontend:
   ```bash
   cd client
   npm install
   ```

2. Criar arquivo `.env` na pasta `client`:
   ```bash
   cp client/.env.example client/.env
   ```

3. Editar `client/.env` com suas credenciais Supabase

### Iniciar a aplicação

Você precisa de **2 terminais**:

**Terminal 1 - Backend (porta 8081):**
```bash
cd server
mvn spring-boot:run
```

**Terminal 2 - Frontend (porta 8080):**
```bash
cd client
npm run dev
```

**Ou use o script (Windows apenas):**
```powershell
.\start-all.bat
```

## 📖 Documentação Completa

Veja o guia detalhado em [SETUP.md](./SETUP.md)

## 🛠️ Tecnologias

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS + Shadcn/ui
- React Query
- React Router

### Backend
- Java 17
- Spring Boot 3.5
- Spring Data JPA
- H2 Database

## 🌐 URLs

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:8081
- **H2 Console:** http://localhost:8081/h2-console
  - JDBC URL: `jdbc:h2:mem:filmesdb`
  - User: `sa`
  - Password: _(vazio)_

## 📁 Estrutura do Projeto

```
trabalho-crud-2-bi/
├── client/          # Frontend React
├── server/          # Backend Spring Boot
├── supabase/        # Configurações Supabase
├── SETUP.md         # Guia completo de setup
├── setup-windows.bat       # Script de setup Windows
├── setup-mac-linux.sh      # Script de setup Mac/Linux
└── start-all.bat          # Inicia tudo (Windows)
```

## 🆘 Problemas?

Consulte a seção **Troubleshooting** em [SETUP.md](./SETUP.md)

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais.
