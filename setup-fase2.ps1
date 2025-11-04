# Quick Start - GamifyPy Fase 2

Write-Host "=======================================" -ForegroundColor Magenta
Write-Host " GamifyPy OWASP - Setup Rapido" -ForegroundColor Magenta
Write-Host "=======================================" -ForegroundColor Magenta
Write-Host ""

# Paso 1: Instalar dependencias
Write-Host "[Paso 1/3] Instalando dependencias de testing..." -ForegroundColor Cyan
Set-Location Frontend\gamifypy

npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

Write-Host "✅ Dependencias instaladas correctamente" -ForegroundColor Green
Write-Host ""

# Paso 2: Ejecutar tests
Write-Host "[Paso 2/3] Ejecutando tests..." -ForegroundColor Cyan
npm run test -- --run

Write-Host "✅ Tests ejecutados" -ForegroundColor Green
Write-Host ""

# Paso 3: Generar coverage
Write-Host "[Paso 3/3] Generando reporte de coverage..." -ForegroundColor Cyan
npm run test:coverage

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Algunos tests fallaron, pero el reporte fue generado" -ForegroundColor Yellow
} else {
    Write-Host "✅ Reporte de coverage generado" -ForegroundColor Green
}

Set-Location ..\..
Write-Host ""

# Resumen
Write-Host "=======================================" -ForegroundColor Green
Write-Host " Setup Completado" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

Write-Host "Proximos pasos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Ver reporte de coverage:" -ForegroundColor White
Write-Host "   start Frontend\gamifypy\coverage\index.html" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Ejecutar análisis completo (con SonarQube):" -ForegroundColor White
Write-Host "   .\run-frontend-analysis.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Leer la guía de soluciones:" -ForegroundColor White
Write-Host "   - README-FASE2.md" -ForegroundColor Gray
Write-Host "   - GUIA-SOLUCIONES.md" -ForegroundColor Gray
Write-Host "   - GUIA-CORRECCION-ISSUES.md" -ForegroundColor Gray
Write-Host ""

# Preguntar si quiere abrir el reporte
$openReport = Read-Host "¿Abrir reporte de coverage ahora? (S/N)"
if ($openReport -eq "S" -or $openReport -eq "s") {
    Start-Process "Frontend\gamifypy\coverage\index.html"
}

Write-Host ""
Write-Host "Todo listo para empezar!" -ForegroundColor Green
