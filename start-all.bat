@echo off
REM Script para iniciar backend e frontend simultaneamente

echo ========================================
echo   Iniciando CineList
echo ========================================
echo.
echo [INFO] Iniciando Backend e Frontend...
echo [INFO] Aguarde os servidores iniciarem
echo.
echo Backend: http://localhost:8081
echo Frontend: http://localhost:8080
echo.

REM Inicia o backend em uma nova janela
start "Backend - Spring Boot" cmd /k "cd server && mvn spring-boot:run"

REM Aguarda alguns segundos para o backend começar
timeout /t 5 /nobreak >nul

REM Inicia o frontend em uma nova janela
start "Frontend - Vite" cmd /k "cd client && npm run dev"

echo.
echo [OK] Servidores iniciados em janelas separadas!
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
