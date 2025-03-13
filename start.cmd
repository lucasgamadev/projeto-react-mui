@echo off
echo Iniciando processo de instalacao e execucao do projeto...
echo.

echo === Instalando dependencias ===
call npm install
if %errorlevel% neq 0 (
    echo Erro ao instalar dependencias.
    pause
    exit /b %errorlevel%
)
echo Dependencias instaladas com sucesso!
echo.

echo === Iniciando o projeto ===
call npm start
if %errorlevel% neq 0 (
    echo Erro ao iniciar o projeto.
    pause
    exit /b %errorlevel%
)

pause 