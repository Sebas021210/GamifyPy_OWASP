# Script para iniciar los contenedores de GamifyPy (SonarQube)
# Solo inicia SonarQube y PostgreSQL (NO dependency-check)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando GamifyPy - SonarQube" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que Docker este corriendo
Write-Host "[1/4] Verificando Docker..." -ForegroundColor Yellow
$dockerRunning = docker version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker no esta corriendo" -ForegroundColor Red
    Write-Host "Por favor, inicia Docker Desktop y espera a que este listo" -ForegroundColor Yellow
    exit 1
}
Write-Host "Docker esta corriendo" -ForegroundColor Green
Write-Host ""

# Detener contenedores anteriores si existen (solo de gamifypy)
Write-Host "[2/4] Limpiando contenedores anteriores..." -ForegroundColor Yellow
docker-compose down 2>$null
Write-Host "Contenedores anteriores detenidos" -ForegroundColor Green
Write-Host ""

# Iniciar solo los servicios principales (sin profiles)
Write-Host "[3/4] Iniciando contenedores..." -ForegroundColor Yellow
Write-Host "   - PostgreSQL para SonarQube" -ForegroundColor Cyan
Write-Host "   - SonarQube Server" -ForegroundColor Cyan
Write-Host ""
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR al iniciar contenedores" -ForegroundColor Red
    exit 1
}
Write-Host ""
Write-Host "Contenedores iniciados correctamente" -ForegroundColor Green
Write-Host ""

# Verificar estado
Write-Host "[4/4] Verificando estado de contenedores..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
docker-compose ps
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LISTO - GamifyPy Iniciado" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "SonarQube estara disponible en: http://localhost:9000" -ForegroundColor Yellow
Write-Host "SonarQube puede tardar 1-2 minutos en iniciar completamente" -ForegroundColor Yellow
Write-Host ""
Write-Host "Credenciales iniciales:" -ForegroundColor Cyan
Write-Host "   Usuario: admin" -ForegroundColor White
Write-Host "   Password: admin" -ForegroundColor White
Write-Host "   (Se te pedira cambiar la contrasena en el primer login)" -ForegroundColor Gray
Write-Host ""
Write-Host "Para ver los logs en tiempo real:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f" -ForegroundColor White
Write-Host ""
Write-Host "Para detener los contenedores:" -ForegroundColor Cyan
Write-Host "   docker-compose down" -ForegroundColor White
Write-Host ""
