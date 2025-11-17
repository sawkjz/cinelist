#!/bin/bash
# Script de setup automatico para Mac/Linux

echo "========================================"
echo "   SETUP - CineList Project"
echo "========================================"
echo ""

# Verificar Node.js
echo "[1/5] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "[ERRO] Node.js não encontrado! Instale em: https://nodejs.org/"
    exit 1
fi
echo "[OK] Node.js encontrado!"
echo ""

# Verificar Java
echo "[2/5] Verificando Java..."
if ! command -v java &> /dev/null; then
    echo "[ERRO] Java não encontrado! Instale Java 17 ou superior"
    exit 1
fi
echo "[OK] Java encontrado!"
echo ""

# Instalar dependencias do frontend
echo "[3/5] Instalando dependências do frontend..."
cd client
if [ -d "node_modules" ]; then
    echo "[AVISO] node_modules já existe. Pulando instalação..."
else
    echo "Executando npm install..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERRO] Falha ao instalar dependências do frontend"
        exit 1
    fi
fi
echo "[OK] Dependências do frontend instaladas!"
echo ""

# Criar arquivo .env se nao existir
echo "[4/5] Configurando arquivo .env..."
if [ -f ".env" ]; then
    echo "[AVISO] Arquivo .env já existe"
else
    echo "Criando arquivo .env a partir do .env.example..."
    cp .env.example .env
    echo "[OK] Arquivo .env criado!"
    echo "[IMPORTANTE] Edite o arquivo client/.env com suas credenciais"
fi
echo ""

# Voltar para raiz
cd ..

# Dar permissao ao mvnw
echo "[5/5] Configurando Maven Wrapper..."
chmod +x server/mvnw
echo "[OK] Permissões configuradas!"
echo ""

echo "========================================"
echo "   SETUP CONCLUÍDO!"
echo "========================================"
echo ""
echo "Próximos passos:"
echo ""
echo "1. Configure o arquivo client/.env com suas credenciais Supabase"
echo ""
echo "2. Abra 2 terminais e execute:"
echo ""
echo "   Terminal 1 - Backend:"
echo "   cd server"
echo "   ./mvnw spring-boot:run"
echo ""
echo "   Terminal 2 - Frontend:"
echo "   cd client"
echo "   npm run dev"
echo ""
echo "3. Acesse: http://localhost:8080"
echo ""
