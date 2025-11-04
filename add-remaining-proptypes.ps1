# Script para Agregar PropTypes a Componentes Faltantes
# GamifyPy OWASP - Fase 2

Write-Host "Agregando PropTypes a componentes faltantes..." -ForegroundColor Cyan

$componentes = @(
    "LevelContent.jsx",
    "PythonLevelsMap.jsx",
    "InsigniaCarousel.jsx",
    "GoogleCallback.jsx"
)

Write-Host "Componentes pendientes: $($componentes.Count)" -ForegroundColor Yellow
foreach ($comp in $componentes) {
    Write-Host "  - $comp" -ForegroundColor Gray
}

Write-Host ""
Write-Host "NOTA: Agregar PropTypes manualmente a estos archivos." -ForegroundColor Yellow
Write-Host "Luego ejecuta el análisis con:" -ForegroundColor Yellow
Write-Host "  .\run-sonarqube-analysis-only.ps1" -ForegroundColor Cyan
