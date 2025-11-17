# 🎯 Guia Rápido - 3 Comandos Essenciais

## 🆕 Primeira Vez (Apenas Uma Vez)

```bash
# 1. Clonar
git clone https://github.com/sawkjz/trabalho-crud-2-bi.git
cd trabalho-crud-2-bi

# 2. Instalar dependências
cd client
npm install

# 3. Configurar .env
copy .env.example .env  # Windows
# ou
cp .env.example .env    # Mac/Linux
```

**Edite o arquivo `client/.env` com suas credenciais!**

---

## 🚀 Toda Vez (Iniciar Projeto)

### Abra 2 Terminais:

**Terminal 1️⃣ - Backend:**
```bash
cd trabalho-crud-2-bi/server
mvn spring-boot:run
```
✅ Aguarde: `Tomcat started on port 8081`

**Terminal 2️⃣ - Frontend:**
```bash
cd trabalho-crud-2-bi/client
npm run dev
```
✅ Aguarde: `Local: http://localhost:8080/`

---

## 🌐 Acessar

**Frontend:** http://localhost:8080  
**Backend:** http://localhost:8081  
**H2 Console:** http://localhost:8081/h2-console

---

## 🛑 Parar

Pressione `Ctrl + C` em cada terminal

---

## 💡 Dica Rápida - Windows

Use o script automático:
```bash
.\start-all.bat
```

---

## ❌ Problema?

**Porta ocupada?**
```bash
netstat -ano | findstr :8080
taskkill /PID <numero> /F
```

**Tela branca?**
- Verifique se `client/.env` existe
- Abra F12 no navegador e veja os erros
- Certifique-se que ambos servidores estão rodando

---

**Documentação completa:** Veja `SETUP.md`  
**Checklist detalhado:** Veja `CHECKLIST.md`
