# Script Simplificado para Análisis SAST
# =========================================

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  ANÁLISIS SAST - GamifyPy_OWASP" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# 1. Verificar Docker
Write-Host "[1/5] Verificando Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker funcionando correctamente`n" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker no está funcionando" -ForegroundColor Red
    Write-Host "Por favor, reinicia Docker Desktop y vuelve a ejecutar este script`n" -ForegroundColor Yellow
    exit 1
}

# 2. Iniciar SonarQube
Write-Host "[2/5] Iniciando SonarQube..." -ForegroundColor Yellow
docker-compose up -d sonarqube
Write-Host "✓ SonarQube iniciado`n" -ForegroundColor Green

# 3. Esperar a que SonarQube esté listo
Write-Host "[3/5] Esperando a que SonarQube esté listo..." -ForegroundColor Yellow
Write-Host "Esto puede tardar 1-2 minutos. Por favor espera...`n" -ForegroundColor Gray

$maxAttempts = 40
$attempt = 0
$ready = $false

while ($attempt -lt $maxAttempts -and -not $ready) {
    Start-Sleep -Seconds 5
    $attempt++
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:9000/api/system/status" -UseBasicParsing -TimeoutSec 3 2>$null
        if ($response.StatusCode -eq 200) {
            $ready = $true
        }
    } catch {
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
}

Write-Host ""
if ($ready) {
    Write-Host "✓ SonarQube está listo!`n" -ForegroundColor Green
} else {
    Write-Host "⚠ SonarQube todavía está iniciando..." -ForegroundColor Yellow
    Write-Host "Puedes continuar manualmente verificando: http://localhost:9000`n" -ForegroundColor Cyan
}

# 4. Instrucciones para configurar token
Write-Host "[4/5] Configuración del Token" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "AHORA DEBES:" -ForegroundColor White
Write-Host "1. Abre http://localhost:9000 en tu navegador" -ForegroundColor Cyan
Write-Host "2. Login: admin / admin" -ForegroundColor Cyan
Write-Host "3. Cambia la contraseña cuando te lo pida" -ForegroundColor Cyan
Write-Host "4. Ve a: My Account > Security > Generate Tokens" -ForegroundColor Cyan
Write-Host "5. Nombre: GamifyPy_Token" -ForegroundColor Cyan
Write-Host "6. Copia el token generado" -ForegroundColor Cyan
Write-Host ""

$openBrowser = Read-Host "¿Deseas abrir SonarQube ahora? (S/N)"
if ($openBrowser -eq "S" -or $openBrowser -eq "s") {
    Start-Process "http://localhost:9000"
    Write-Host "`nNavegador abierto. Genera el token y luego vuelve aquí." -ForegroundColor Green
}

Write-Host ""
$token = Read-Host "Pega aquí tu token de SonarQube"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "`n✗ No se proporcionó token" -ForegroundColor Red
    Write-Host "Ejecuta el análisis manualmente con:" -ForegroundColor Yellow
    Write-Host ".\run-sonar-analysis.ps1`n" -ForegroundColor Cyan
    exit 1
}

# Guardar token
$envContent = Get-Content ".sonarqube-env.template"
$envContent -replace "YOUR_SONARQUBE_TOKEN_HERE", $token | Set-Content ".sonarqube-env"
Write-Host "✓ Token guardado`n" -ForegroundColor Green

# 5. Ejecutar análisis de SonarQube
Write-Host "[5/5] Ejecutando Análisis SAST con SonarQube..." -ForegroundColor Yellow
Write-Host "Esto puede tardar 2-5 minutos...`n" -ForegroundColor Gray

docker run --rm `
    --network host `
    -v "${PWD}:/usr/src" `
    sonarsource/sonar-scanner-cli `
    -Dsonar.projectKey=gamifypy-owasp `
    -Dsonar.sources=backend,Frontend/gamifypy/src `
    -Dsonar.host.url=http://localhost:9000 `
    -Dsonar.token=$token

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Análisis SAST completado exitosamente!`n" -ForegroundColor Green
} else {
    Write-Host "`n⚠ Análisis completado con advertencias`n" -ForegroundColor Yellow
}

# Resumen
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ANÁLISIS COMPLETADO" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Ver resultados en:" -ForegroundColor White
Write-Host "   http://localhost:9000/dashboard?id=gamifypy-owasp`n" -ForegroundColor Cyan
Write-Host "🔍 Busca:" -ForegroundColor White
Write-Host "   - Vulnerabilidades de SQL Injection" -ForegroundColor Yellow
Write-Host "   - Vulnerabilidades de XSS" -ForegroundColor Yellow
Write-Host "   - Problemas de validación de entrada" -ForegroundColor Yellow
Write-Host "   - Bugs de seguridad" -ForegroundColor Yellow
Write-Host ""

$openDashboard = Read-Host "¿Deseas abrir el dashboard de resultados? (S/N)"
if ($openDashboard -eq "S" -or $openDashboard -eq "s") {
    Start-Process "http://localhost:9000/dashboard?id=gamifypy-owasp"
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  SIGUIENTE: Análisis de Dependencias OWASP" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para ejecutar OWASP Dependency Check:" -ForegroundColor White
Write-Host "   .\run-dependency-check.ps1`n" -ForegroundColor Cyan

Write-Host "¡Análisis SAST completado! 🎉`n" -ForegroundColor Green
