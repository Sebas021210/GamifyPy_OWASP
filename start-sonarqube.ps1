# Script de PowerShell - Inicio Rápido de SonarQube
# ====================================================

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Inicio Rápido - SonarQube para GamifyPy_OWASP" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Función para verificar si Docker está corriendo
function Test-DockerRunning {
    try {
        docker ps | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Verificar Docker
Write-Host "Verificando Docker..." -ForegroundColor Yellow
if (-Not (Test-DockerRunning)) {
    Write-Host "✗ Docker no está corriendo" -ForegroundColor Red
    Write-Host "Por favor, inicia Docker Desktop y vuelve a intentar" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Docker está corriendo" -ForegroundColor Green

# Verificar si SonarQube ya está corriendo
Write-Host ""
Write-Host "Verificando estado de SonarQube..." -ForegroundColor Yellow
$sonarRunning = docker-compose ps -q sonarqube 2>$null
if ($sonarRunning) {
    Write-Host "✓ SonarQube ya está corriendo" -ForegroundColor Green
    Write-Host "  Accede en: http://localhost:9000" -ForegroundColor Cyan
    Write-Host ""
    $restart = Read-Host "¿Deseas reiniciar SonarQube? (S/N)"
    if ($restart -eq "S" -or $restart -eq "s") {
        Write-Host "Reiniciando SonarQube..." -ForegroundColor Yellow
        docker-compose restart sonarqube
    }
} else {
    Write-Host "Iniciando SonarQube..." -ForegroundColor Yellow
    docker-compose up -d sonarqube
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ SonarQube iniciado correctamente" -ForegroundColor Green
        Write-Host ""
        Write-Host "Esperando a que SonarQube esté listo..." -ForegroundColor Yellow
        Write-Host "Esto puede tardar 1-2 minutos..." -ForegroundColor Yellow
        
        $maxAttempts = 60
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
            Write-Host "✓ SonarQube está listo!" -ForegroundColor Green
        } else {
            Write-Host "⚠ SonarQube está iniciando, pero puede tardar un poco más" -ForegroundColor Yellow
            Write-Host "  Verifica los logs con: docker-compose logs -f sonarqube" -ForegroundColor Cyan
        }
    } else {
        Write-Host "✗ Error al iniciar SonarQube" -ForegroundColor Red
        Write-Host "Verifica los logs con: docker-compose logs sonarqube" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Información de Acceso" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "URL: http://localhost:9000" -ForegroundColor Green
Write-Host "Usuario por defecto: admin" -ForegroundColor Cyan
Write-Host "Contraseña por defecto: admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANTE: Cambia la contraseña en el primer inicio" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Próximos Pasos" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "1. Accede a SonarQube en tu navegador" -ForegroundColor White
Write-Host "2. Inicia sesión y cambia la contraseña" -ForegroundColor White
Write-Host "3. Genera un token en: My Account > Security" -ForegroundColor White
Write-Host "4. Ejecuta el análisis con: .\run-sonar-analysis.ps1" -ForegroundColor White
Write-Host ""

$openBrowser = Read-Host "¿Deseas abrir SonarQube en el navegador? (S/N)"
if ($openBrowser -eq "S" -or $openBrowser -eq "s") {
    Start-Process "http://localhost:9000"
}
