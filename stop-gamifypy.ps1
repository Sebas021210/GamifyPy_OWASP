# Script para detener los contenedores de GamifyPy (SonarQube)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deteniendo GamifyPy - SonarQube" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Deteniendo contenedores..." -ForegroundColor Yellow
docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Contenedores detenidos correctamente" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ERROR al detener contenedores" -ForegroundColor Red
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
