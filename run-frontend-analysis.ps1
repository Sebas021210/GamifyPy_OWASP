# Script completo para analisis de Frontend con Coverage
# GamifyPy OWASP - Analisis Completo Frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GamifyPy - Analisis Completo Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si SonarQube esta corriendo
Write-Host "[Pre-check] Verificando SonarQube..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:9000" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  OK - SonarQube esta corriendo" -ForegroundColor Green
} catch {
    Write-Host "  ERROR - SonarQube no esta corriendo" -ForegroundColor Red
    Write-Host ""
    Write-Host "Ejecuta primero: .\start-sonarqube.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Verificar que exista el directorio del frontend
if (-Not (Test-Path "Frontend\gamifypy")) {
    Write-Host "  ERROR - No se encuentra el directorio Frontend/gamifypy" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Paso 1: Ejecutar tests y generar coverage
Write-Host "[1/4] Ejecutando tests con coverage..." -ForegroundColor Yellow
Write-Host "  Generando reporte de cobertura..." -ForegroundColor Gray
Write-Host ""

.\run-frontend-tests.ps1

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "  ERROR: Fallo en la ejecucion de tests" -ForegroundColor Red
    exit 1
}

# Verificar que se generó el coverage
if (-Not (Test-Path "Frontend\gamifypy\coverage\lcov.info")) {
    Write-Host ""
    Write-Host "  ADVERTENCIA: No se genero el archivo lcov.info" -ForegroundColor Yellow
    Write-Host "  El analisis continuara pero sin datos de coverage" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "  OK - Coverage generado exitosamente" -ForegroundColor Green
    Write-Host ""
}

Write-Host ""

# Paso 2: Ejecutar analisis SAST con SonarQube
Write-Host "[2/4] Ejecutando analisis SAST con SonarQube..." -ForegroundColor Yellow

# Verificar si existe el token de SonarQube
$tokenFile = ".sonarqube-token"
$token = ""

if (Test-Path $tokenFile) {
    $token = Get-Content $tokenFile -Raw
    $token = $token.Trim()
}

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host ""
    Write-Host "  NECESITAS UN TOKEN DE SONARQUBE:" -ForegroundColor Yellow
    Write-Host "  1. Abre: http://localhost:9000/account/security" -ForegroundColor Cyan
    Write-Host "  2. Login: admin / tu-contrasena" -ForegroundColor Cyan
    Write-Host "  3. Genera un nuevo token" -ForegroundColor Cyan
    Write-Host ""
    
    $token = Read-Host "  Pega tu token aqui"
    
    if ([string]::IsNullOrWhiteSpace($token)) {
        Write-Host "  ERROR: No se proporciono un token valido" -ForegroundColor Red
        exit 1
    }
    
    # Guardar token
    $token | Set-Content $tokenFile
    Write-Host "  Token guardado" -ForegroundColor Green
}

Write-Host "  Iniciando analisis de codigo con Docker..." -ForegroundColor White
Write-Host "  • Proyecto: gamifypy-owasp-frontend" -ForegroundColor Gray
Write-Host "  • Fuentes: Frontend/gamifypy/src" -ForegroundColor Gray
Write-Host "  • Tests: Frontend/gamifypy/src/test" -ForegroundColor Gray
Write-Host "  • Coverage: Frontend/gamifypy/coverage/lcov.info" -ForegroundColor Gray
Write-Host ""
Write-Host "  Esto puede tardar 2-5 minutos..." -ForegroundColor Gray
Write-Host ""

$sonarStartTime = Get-Date

& docker run --rm `
    --network host `
    -v "${PWD}:/usr/src" `
    sonarsource/sonar-scanner-cli:latest `
    "-Dsonar.projectKey=gamifypy-owasp-frontend" `
    "-Dsonar.projectName=GamifyPy Frontend" `
    "-Dsonar.projectVersion=2.0" `
    "-Dsonar.sources=Frontend/gamifypy/src" `
    "-Dsonar.tests=Frontend/gamifypy/src/test" `
    "-Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/*.test.js,**/*.test.jsx,**/test/**,**/coverage/**,**/*.config.js" `
    "-Dsonar.javascript.lcov.reportPaths=Frontend/gamifypy/coverage/lcov.info" `
    "-Dsonar.sourceEncoding=UTF-8" `
    "-Dsonar.host.url=http://localhost:9000" `
    "-Dsonar.token=$token"

$sonarEndTime = Get-Date
$sonarDuration = ($sonarEndTime - $sonarStartTime).TotalSeconds

Write-Host ""
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ANALISIS DE SONARQUBE COMPLETADO" -ForegroundColor Green
    Write-Host "  Tiempo: $([math]::Round($sonarDuration, 1)) segundos" -ForegroundColor Gray
} else {
    Write-Host "  ERROR: Analisis fallido" -ForegroundColor Red
    Write-Host "  Codigo de salida: $LASTEXITCODE" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Verifica que:" -ForegroundColor Yellow
    Write-Host "  • SonarQube este corriendo en http://localhost:9000" -ForegroundColor Gray
    Write-Host "  • El token sea valido" -ForegroundColor Gray
    Write-Host "  • Exista el archivo coverage/lcov.info" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "  OK - Analisis SAST completado exitosamente" -ForegroundColor Green
Write-Host ""

# Paso 3: Ejecutar OWASP Dependency Check
Write-Host "[3/4] Ejecutando OWASP Dependency Check..." -ForegroundColor Yellow
.\run-dependency-check.ps1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Advertencia: Dependency Check completado con observaciones" -ForegroundColor Yellow
}

Write-Host ""

# Paso 4: Resumen
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Analisis Completo Finalizado!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Resumen de analisis:" -ForegroundColor Cyan
Write-Host "  • Tests ejecutados y coverage generado" -ForegroundColor White
Write-Host "  • Codigo analizado por SonarQube" -ForegroundColor White
Write-Host "  • Dependencias verificadas con OWASP DC" -ForegroundColor White
Write-Host ""
Write-Host "Reportes disponibles:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. SonarQube Dashboard:" -ForegroundColor Yellow
Write-Host "     http://localhost:9000/dashboard?id=gamifypy-owasp-frontend" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. Coverage Report:" -ForegroundColor Yellow
Write-Host "     Frontend\gamifypy\coverage\index.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. Dependency Check:" -ForegroundColor Yellow
Write-Host "     dependency-check-reports\dependency-check-report.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANTE: Espera 1-2 minutos para que SonarQube procese" -ForegroundColor Yellow
Write-Host "            los resultados antes de abrir el dashboard" -ForegroundColor Yellow
Write-Host ""

# Abrir SonarQube en el navegador
$openBrowser = Read-Host "Abrir SonarQube en el navegador? (S/N)"
if ($openBrowser -eq "S" -or $openBrowser -eq "s") {
    Write-Host ""
    Write-Host "  Abriendo navegador..." -ForegroundColor Green
    Write-Host "  Si no ves los cambios, espera 1-2 minutos y refresca la pagina" -ForegroundColor Gray
    Start-Process "http://localhost:9000/dashboard?id=gamifypy-owasp-frontend"
}

Write-Host ""
Write-Host "Script completado!" -ForegroundColor Green
Write-Host ""
