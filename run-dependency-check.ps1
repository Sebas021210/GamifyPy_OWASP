# Script de PowerShell para ejecutar OWASP Dependency Check
# ===========================================================

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  OWASP Dependency Check para GamifyPy_OWASP" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Crear directorio para reportes si no existe
$reportDir = "dependency-check-reports"
if (-Not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir | Out-Null
    Write-Host "✓ Directorio de reportes creado: $reportDir" -ForegroundColor Green
}

Write-Host ""
Write-Host "Ejecutando OWASP Dependency Check..." -ForegroundColor Yellow
Write-Host "Este proceso puede tardar varios minutos la primera vez..." -ForegroundColor Yellow
Write-Host ""

# Ejecutar OWASP Dependency Check con Docker
docker run --rm `
    -v "${PWD}:/src" `
    -v "${PWD}/dependency-check-reports:/report" `
    -v "dependency-check-data:/usr/share/dependency-check/data" `
    owasp/dependency-check:latest `
    --scan /src `
    --format "ALL" `
    --project "GamifyPy_OWASP" `
    --out /report `
    --enableExperimental `
    --exclude "**/node_modules/**" `
    --exclude "**/__pycache__/**" `
    --exclude "**/venv/**" `
    --exclude "**/env/**" `
    --exclude "**/.venv/**"

$exitCode = $LASTEXITCODE

Write-Host ""
if ($exitCode -eq 0) {
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host "  Análisis de dependencias completado" -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Reportes generados en: $reportDir" -ForegroundColor Green
    Write-Host "- HTML: dependency-check-report.html" -ForegroundColor Cyan
    Write-Host "- JSON: dependency-check-report.json" -ForegroundColor Cyan
    Write-Host "- XML: dependency-check-report.xml" -ForegroundColor Cyan
    Write-Host ""
    
    # Intentar abrir el reporte HTML
    $htmlReport = Join-Path $reportDir "dependency-check-report.html"
    if (Test-Path $htmlReport) {
        $open = Read-Host "¿Deseas abrir el reporte HTML? (S/N)"
        if ($open -eq "S" -or $open -eq "s") {
            Start-Process $htmlReport
        }
    }
} else {
    Write-Host "ERROR: El análisis de dependencias falló" -ForegroundColor Red
    Write-Host "Código de salida: $exitCode" -ForegroundColor Red
}
