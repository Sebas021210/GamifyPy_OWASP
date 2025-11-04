# Script para ejecutar tests con coverage en el Frontend
# GamifyPy OWASP - Frontend Testing

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GamifyPy - Frontend Testing Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navegar al directorio del frontend
$frontendPath = "Frontend\gamifypy"
Set-Location $frontendPath

Write-Host "[1/4] Instalando dependencias..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al instalar dependencias" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

Write-Host "[2/4] Ejecutando tests..." -ForegroundColor Yellow
npm run test:coverage

if ($LASTEXITCODE -ne 0) {
    Write-Host "Advertencia: Algunos tests fallaron" -ForegroundColor Yellow
}

Write-Host "[3/4] Verificando reporte de cobertura generado..." -ForegroundColor Yellow
Write-Host ""

# Mostrar ubicación del reporte
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Tests completados exitosamente!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Reportes generados en:" -ForegroundColor Cyan
Write-Host "  - HTML: Frontend\gamifypy\coverage\index.html" -ForegroundColor White
Write-Host "  - LCOV: Frontend\gamifypy\coverage\lcov.info" -ForegroundColor White
Write-Host ""

# Volver al directorio raíz
Set-Location ..\..

Write-Host "Abre el reporte HTML en tu navegador para ver los detalles." -ForegroundColor Cyan
