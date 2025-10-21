# Script Todo-en-Uno - SonarQube y OWASP Dependency Check
# ==========================================================

param(
    [switch]$SkipDependencyCheck,
    [switch]$SkipSonarQube,
    [switch]$OnlyStart
)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Análisis Completo de Código - GamifyPy_OWASP" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
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

# 1. Verificar Docker
Write-Host "[1/5] Verificando Docker..." -ForegroundColor Yellow
if (-Not (Test-DockerRunning)) {
    Write-Host "✗ Docker no está corriendo" -ForegroundColor Red
    Write-Host "Por favor, inicia Docker Desktop y vuelve a intentar" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Docker está corriendo" -ForegroundColor Green
Write-Host ""

# 2. Iniciar SonarQube
Write-Host "[2/5] Iniciando SonarQube..." -ForegroundColor Yellow
$sonarRunning = docker-compose ps -q sonarqube 2>$null
if (-not $sonarRunning) {
    docker-compose up -d sonarqube
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ SonarQube iniciado" -ForegroundColor Green
        Write-Host "  Esperando a que esté listo (esto puede tardar 1-2 minutos)..." -ForegroundColor Gray
        
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
            Write-Host "✓ SonarQube está listo" -ForegroundColor Green
        } else {
            Write-Host "⚠ SonarQube puede necesitar más tiempo" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ Error al iniciar SonarQube" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ SonarQube ya está corriendo" -ForegroundColor Green
}
Write-Host ""

# Si solo se quiere iniciar, terminar aquí
if ($OnlyStart) {
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "  SonarQube está listo en: http://localhost:9000" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Credenciales por defecto:" -ForegroundColor Yellow
    Write-Host "  Usuario: admin" -ForegroundColor Cyan
    Write-Host "  Contraseña: admin" -ForegroundColor Cyan
    Write-Host ""
    
    $open = Read-Host "¿Abrir SonarQube en el navegador? (S/N)"
    if ($open -eq "S" -or $open -eq "s") {
        Start-Process "http://localhost:9000"
    }
    exit 0
}

# 3. Ejecutar OWASP Dependency Check
if (-not $SkipDependencyCheck) {
    Write-Host "[3/5] Ejecutando OWASP Dependency Check..." -ForegroundColor Yellow
    Write-Host "  Este proceso puede tardar varios minutos..." -ForegroundColor Gray
    
    if (-Not (Test-Path "dependency-check-reports")) {
        New-Item -ItemType Directory -Path "dependency-check-reports" | Out-Null
    }
    
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
        --exclude "**/venv/**" 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Dependency Check completado" -ForegroundColor Green
        Write-Host "  Reportes en: dependency-check-reports/" -ForegroundColor Cyan
    } else {
        Write-Host "⚠ Dependency Check completado con advertencias" -ForegroundColor Yellow
    }
} else {
    Write-Host "[3/5] OWASP Dependency Check omitido" -ForegroundColor Gray
}
Write-Host ""

# 4. Ejecutar análisis de SonarQube
if (-not $SkipSonarQube) {
    Write-Host "[4/5] Ejecutando análisis de SonarQube..." -ForegroundColor Yellow
    
    # Verificar token
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
        Write-Host "⚠ Se requiere un token de SonarQube" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Para generar un token:" -ForegroundColor Cyan
        Write-Host "1. Abre http://localhost:9000" -ForegroundColor White
        Write-Host "2. Inicia sesión (admin/admin - cambia la contraseña)" -ForegroundColor White
        Write-Host "3. My Account > Security > Generate Tokens" -ForegroundColor White
        Write-Host ""
        $token = Read-Host "Ingresa tu token de SonarQube"
        
        if (-not [string]::IsNullOrWhiteSpace($token)) {
            $envTemplate = Get-Content ".sonarqube-env.template"
            $envTemplate -replace "YOUR_SONARQUBE_TOKEN_HERE", $token | Set-Content $tokenFile
            Write-Host "✓ Token guardado" -ForegroundColor Green
        } else {
            Write-Host "✗ Token no proporcionado, omitiendo análisis de SonarQube" -ForegroundColor Red
            $SkipSonarQube = $true
        }
    }
    
    if (-not $SkipSonarQube) {
        Write-Host "  Ejecutando análisis..." -ForegroundColor Gray
        
        docker run --rm `
            --network host `
            -v "${PWD}:/usr/src" `
            sonarsource/sonar-scanner-cli `
            -Dsonar.projectKey=gamifypy-owasp `
            -Dsonar.sources=. `
            -Dsonar.host.url=http://localhost:9000 `
            -Dsonar.token=$token 2>$null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Análisis de SonarQube completado" -ForegroundColor Green
        } else {
            Write-Host "⚠ Análisis completado con advertencias" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "[4/5] Análisis de SonarQube omitido" -ForegroundColor Gray
}
Write-Host ""

# 5. Resumen
Write-Host "[5/5] Resumen de Resultados" -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Análisis Completado" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

if (-not $SkipSonarQube) {
    Write-Host "📊 SonarQube Dashboard:" -ForegroundColor White
    Write-Host "   http://localhost:9000/dashboard?id=gamifypy-owasp" -ForegroundColor Cyan
    Write-Host ""
}

if (-not $SkipDependencyCheck) {
    Write-Host "🛡️ OWASP Dependency Check:" -ForegroundColor White
    Write-Host "   dependency-check-reports\dependency-check-report.html" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "Para más detalles, consulta: SETUP_SONARQUBE.md" -ForegroundColor Gray
Write-Host ""

# Preguntar si abrir reportes
$openReports = Read-Host "¿Deseas abrir los reportes? (S/N)"
if ($openReports -eq "S" -or $openReports -eq "s") {
    if (-not $SkipSonarQube) {
        Start-Process "http://localhost:9000/dashboard?id=gamifypy-owasp"
    }
    if (-not $SkipDependencyCheck) {
        $htmlReport = "dependency-check-reports\dependency-check-report.html"
        if (Test-Path $htmlReport) {
            Start-Process $htmlReport
        }
    }
}

Write-Host ""
Write-Host "¡Análisis completado! 🎉" -ForegroundColor Green
Write-Host ""
