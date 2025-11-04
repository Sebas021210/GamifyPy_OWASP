# Script SOLO para analizar codigo con SonarQube (sin tests)
# Usa este script si ya ejecutaste los tests y tienes coverage generado
# GamifyPy OWASP - Analisis SAST

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  GamifyPy - Analisis SonarQube (SAST)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
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

# Verificar que exista el coverage
if (-Not (Test-Path "Frontend\gamifypy\coverage\lcov.info")) {
    Write-Host "  ERROR - No se encuentra el archivo lcov.info" -ForegroundColor Red
    Write-Host ""
    Write-Host "Ejecuta primero: .\run-frontend-tests.ps1" -ForegroundColor Yellow
    Write-Host "O manualmente: cd Frontend\gamifypy; npm run test:coverage" -ForegroundColor Yellow
    Write-Host ""
    exit 1
} else {
    Write-Host "  OK - Archivo de coverage encontrado" -ForegroundColor Green
}

Write-Host ""

# Verificar token de SonarQube
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
        Write-Host "  ERROR - No se proporciono un token valido" -ForegroundColor Red
        exit 1
    }
    
    # Guardar token
    $token | Set-Content $tokenFile
    Write-Host "  OK - Token guardado" -ForegroundColor Green
} else {
    Write-Host "  OK - Token de SonarQube configurado" -ForegroundColor Green
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Analisis de Codigo (SAST)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuracion del analisis:" -ForegroundColor White
Write-Host "  - Proyecto: gamifypy-owasp-frontend" -ForegroundColor Gray
Write-Host "  - Fuentes: Frontend/gamifypy/src" -ForegroundColor Gray
Write-Host "  - Tests: Frontend/gamifypy/src/test" -ForegroundColor Gray
Write-Host "  - Coverage: Frontend/gamifypy/coverage/lcov.info" -ForegroundColor Gray
Write-Host ""
Write-Host "  Esto puede tardar 2-5 minutos..." -ForegroundColor Yellow
Write-Host "  (El scanner analizara 33 archivos JavaScript/JSX)" -ForegroundColor Gray
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

$sonarExitCode = $LASTEXITCODE
$sonarEndTime = Get-Date
$sonarDuration = ($sonarEndTime - $sonarStartTime).TotalSeconds

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan

if ($sonarExitCode -eq 0) {
    Write-Host "  ANALISIS COMPLETADO EXITOSAMENTE" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Resumen:" -ForegroundColor White
    Write-Host "  - Tiempo de analisis: $([math]::Round($sonarDuration, 1)) segundos" -ForegroundColor Gray
    Write-Host "  - Archivos analizados: 33 (JavaScript/JSX)" -ForegroundColor Gray
    Write-Host "  - Coverage incluido: Si (lcov.info)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Dashboard de SonarQube:" -ForegroundColor Yellow
    Write-Host "  http://localhost:9000/dashboard?id=gamifypy-owasp-frontend" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "IMPORTANTE:" -ForegroundColor Yellow
    Write-Host "  - Espera 1-2 minutos para que SonarQube procese los resultados" -ForegroundColor Gray
    Write-Host "  - Refresca el dashboard si no ves cambios inmediatamente" -ForegroundColor Gray
    Write-Host ""
    
    $openBrowser = Read-Host "Abrir SonarQube en el navegador? (S/N)"
    if ($openBrowser -eq "S" -or $openBrowser -eq "s") {
        Write-Host ""
        Write-Host "  Abriendo navegador..." -ForegroundColor Green
        Start-Process "http://localhost:9000/dashboard?id=gamifypy-owasp-frontend"
    }
    
    Write-Host ""
    Write-Host "Analisis completado!" -ForegroundColor Green
    Write-Host ""
    
} else {
    Write-Host "  ANALISIS FALLIDO" -ForegroundColor Red
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Codigo de salida: $sonarExitCode" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifica que:" -ForegroundColor Yellow
    Write-Host "  - SonarQube este corriendo en http://localhost:9000" -ForegroundColor Gray
    Write-Host "  - El token sea valido" -ForegroundColor Gray
    Write-Host "  - Exista el archivo Frontend\gamifypy\coverage\lcov.info" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Revisa los mensajes de error anteriores para mas detalles" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
