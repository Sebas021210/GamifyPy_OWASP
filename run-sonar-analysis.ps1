# Script de PowerShell para ejecutar análisis de SonarQube en Windows
# =====================================================================

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Análisis de SonarQube para GamifyPy_OWASP" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si existe el archivo de configuración
if (-Not (Test-Path "sonar-project.properties")) {
    Write-Host "ERROR: No se encontró el archivo sonar-project.properties" -ForegroundColor Red
    exit 1
}

# Verificar si SonarQube está corriendo
Write-Host "Verificando conexión con SonarQube..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:9000/api/system/status" -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ SonarQube está disponible" -ForegroundColor Green
} catch {
    Write-Host "✗ SonarQube no está disponible. Por favor, inicia SonarQube con:" -ForegroundColor Red
    Write-Host "  docker-compose up -d sonarqube" -ForegroundColor Yellow
    exit 1
}

# Leer el token desde el archivo de entorno o solicitarlo
$tokenFile = ".sonarqube-env"
$token = ""

if (Test-Path $tokenFile) {
    $envContent = Get-Content $tokenFile
    foreach ($line in $envContent) {
        if ($line -match "^SONAR_TOKEN=(.+)$") {
            $token = $matches[1]
            if ($token -ne "YOUR_SONARQUBE_TOKEN_HERE") {
                break
            }
        }
    }
}

if ([string]::IsNullOrWhiteSpace($token) -or $token -eq "YOUR_SONARQUBE_TOKEN_HERE") {
    Write-Host ""
    Write-Host "Por favor, genera un token en SonarQube:" -ForegroundColor Yellow
    Write-Host "1. Abre http://localhost:9000" -ForegroundColor Cyan
    Write-Host "2. Inicia sesión (usuario: admin, contraseña: admin)" -ForegroundColor Cyan
    Write-Host "3. Ve a My Account > Security > Generate Tokens" -ForegroundColor Cyan
    Write-Host ""
    $token = Read-Host "Ingresa tu token de SonarQube"
    
    # Guardar el token en el archivo
    $envTemplate = Get-Content ".sonarqube-env.template"
    $envTemplate -replace "YOUR_SONARQUBE_TOKEN_HERE", $token | Set-Content $tokenFile
    Write-Host "✓ Token guardado en $tokenFile" -ForegroundColor Green
}

# Verificar si sonar-scanner está instalado
Write-Host ""
Write-Host "Verificando sonar-scanner..." -ForegroundColor Yellow
$scannerCmd = Get-Command sonar-scanner -ErrorAction SilentlyContinue

if (-Not $scannerCmd) {
    Write-Host "✗ sonar-scanner no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Opciones para instalar sonar-scanner:" -ForegroundColor Yellow
    Write-Host "1. Descargar desde: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/" -ForegroundColor Cyan
    Write-Host "2. O usar el contenedor Docker (recomendado)" -ForegroundColor Cyan
    Write-Host ""
    $useDocker = Read-Host "¿Deseas usar Docker para el análisis? (S/N)"
    
    if ($useDocker -eq "S" -or $useDocker -eq "s") {
        Write-Host ""
        Write-Host "Ejecutando análisis con Docker..." -ForegroundColor Green
        docker run --rm `
            --network host `
            -v "${PWD}:/usr/src" `
            sonarsource/sonar-scanner-cli `
            -Dsonar.projectKey=gamifypy-owasp `
            -Dsonar.sources=. `
            -Dsonar.host.url=http://localhost:9000 `
            -Dsonar.token=$token
    } else {
        Write-Host "Por favor, instala sonar-scanner y vuelve a ejecutar este script" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✓ sonar-scanner encontrado" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ejecutando análisis de SonarQube..." -ForegroundColor Green
    Write-Host ""
    
    # Ejecutar sonar-scanner
    sonar-scanner -Dsonar.token=$token
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Análisis completado" -ForegroundColor Cyan
Write-Host "  Ver resultados en: http://localhost:9000" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
