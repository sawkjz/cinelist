@echo off
REM Script de setup automatico para Windows
echo ========================================
echo   SETUP - CineList Project
echo ========================================
echo.

REM Verificar Node.js
echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Node.js nao encontrado! Instale em: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js encontrado!
echo.

REM Verificar Java
echo [2/5] Verificando Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Java nao encontrado! Instale Java 17 ou superior
    pause
    exit /b 1
)
echo [OK] Java encontrado!
echo.

REM Instalar dependencias do frontend
echo [3/5] Instalando dependencias do frontend...
cd client
if exist "node_modules\" (
    echo [AVISO] node_modules ja existe. Pulando instalacao...
) else (
    echo Executando npm install...
    call npm install
    if errorlevel 1 (
        echo [ERRO] Falha ao instalar dependencias do frontend
        pause
        exit /b 1
    )
)
echo [OK] Dependencias do frontend instaladas!
echo.

REM Criar arquivo .env se nao existir
echo [4/5] Configurando arquivo .env...
if exist ".env" (
    echo [AVISO] Arquivo .env ja existe
) else (
    echo Criando arquivo .env a partir do .env.example...
    copy .env.example .env >nul
    echo [OK] Arquivo .env criado!
    echo [IMPORTANTE] Edite o arquivo client\.env com suas credenciais
)
echo.

REM Voltar para raiz
cd ..

echo [5/5] Verificando backend...
echo [INFO] Backend nao precisa de instalacao
echo [INFO] O Maven Wrapper ira baixar dependencias automaticamente
echo.

echo ========================================
echo   SETUP CONCLUIDO!
echo ========================================
echo.
echo Proximos passos:
echo.
echo 1. Configure o arquivo client\.env com suas credenciais Supabase
echo.
echo 2. Abra 2 terminais e execute:
echo.
echo    Terminal 1 - Backend:
echo    cd server
echo    mvn spring-boot:run
echo.
echo    Terminal 2 - Frontend:
echo    cd client
echo    npm run dev
echo.
echo 3. Acesse: http://localhost:8080
echo.
pause
