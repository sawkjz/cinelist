🎯 Resumo - O Que Fazer Toda Vez:
🆕 PRIMEIRA VEZ (apenas uma vez após clonar):

# Windows - Opção Automática
.\setup-windows.bat

# OU Manual
cd client
npm install
copy .env.example .env
# Edite o .env com suas credenciais

🚀 TODA VEZ (para iniciar o projeto):
Opção 1 - Script Automático (Windows):

.\start-all.bat

Opção 2 - Manual (recomendado):

cd server
mvn spring-boot:run

Terminal 1:

cd server
mvn spring-boot:run

Terminal 2:

cd client
npm run dev

🌐 Acesse:
Frontend: http://localhost:8080
Backend: http://localhost:8081