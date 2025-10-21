# ====================================================================
# SCRIPT DE ANÁLISIS SAST COMPLETO - GamifyPy_OWASP
# ====================================================================
# Este script ejecuta:
# 1. Análisis estático con SonarQube (sonar-scanner)
# 2. Análisis de dependencias con OWASP Dependency Check
# 3. Genera reportes completos para ambos análisis
# ====================================================================

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "           ANÁLISIS SAST COMPLETO - GamifyPy_OWASP" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Este script ejecutará:" -ForegroundColor White
Write-Host "  1. Análisis estático con SonarQube (sonar-scanner)" -ForegroundColor Yellow
Write-Host "  2. Análisis de dependencias con OWASP Dependency Check" -ForegroundColor Yellow
Write-Host ""

# ====================================================================
# PASO 1: VERIFICACIONES PREVIAS
# ====================================================================
Write-Host "[PASO 1/4] Verificaciones Previas" -ForegroundColor Cyan
Write-Host "-------------------------------------------------------------------" -ForegroundColor Gray

# Verificar Docker
Write-Host "  • Verificando Docker..." -NoNewline
try {
    docker ps | Out-Null
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " ERROR" -ForegroundColor Red
    Write-Host ""
    Write-Host "Docker no está funcionando. Por favor:" -ForegroundColor Red
    Write-Host "  1. Inicia Docker Desktop" -ForegroundColor Yellow
    Write-Host "  2. Espera a que esté listo" -ForegroundColor Yellow
    Write-Host "  3. Ejecuta este script nuevamente" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Verificar SonarQube
Write-Host "  • Verificando SonarQube..." -NoNewline
$sonarRunning = docker ps --filter "name=sonarqube" --filter "health=healthy" --format "{{.Names}}" 2>$null
if ($sonarRunning) {
    Write-Host " OK (corriendo)" -ForegroundColor Green
} else {
    Write-Host " INICIANDO..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "    SonarQube no está corriendo. Iniciando..." -ForegroundColor Yellow
    docker-compose up -d sonarqube sonarqube-db
    
    Write-Host "    Esperando a que SonarQube esté listo (1-2 minutos)..." -ForegroundColor Gray
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
        Write-Host "    SonarQube está listo!" -ForegroundColor Green
    } else {
        Write-Host "    ADVERTENCIA: SonarQube puede necesitar más tiempo" -ForegroundColor Yellow
        Write-Host "    Verifica manualmente en: http://localhost:9000" -ForegroundColor Cyan
    }
}

Write-Host ""

# ====================================================================
# PASO 2: CONFIGURAR TOKEN DE SONARQUBE
# ====================================================================
Write-Host "[PASO 2/4] Configuración del Token de SonarQube" -ForegroundColor Cyan
Write-Host "-------------------------------------------------------------------" -ForegroundColor Gray
Write-Host ""

# Verificar si ya existe un token guardado
$tokenFile = ".sonarqube-token"
$token = ""

if (Test-Path $tokenFile) {
    $token = Get-Content $tokenFile -Raw
    $token = $token.Trim()
    
    if (-not [string]::IsNullOrWhiteSpace($token) -and $token -ne "YOUR_SONARQUBE_TOKEN_HERE") {
        Write-Host "  Token existente encontrado." -ForegroundColor Green
        $useExisting = Read-Host "  ¿Usar el token guardado? (S/N)"
        
        if ($useExisting -eq "N" -or $useExisting -eq "n") {
            $token = ""
        }
    } else {
        $token = ""
    }
}

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host ""
    Write-Host "  NECESITAS GENERAR UN TOKEN EN SONARQUBE:" -ForegroundColor Yellow
    Write-Host "  ------------------------------------------------" -ForegroundColor Gray
    Write-Host "  1. Abre: http://localhost:9000" -ForegroundColor Cyan
    Write-Host "  2. Login: admin / admin" -ForegroundColor Cyan
    Write-Host "     (Si es primera vez, te pedirá cambiar la contraseña)" -ForegroundColor Gray
    Write-Host "  3. Ve a: My Account > Security > Generate Tokens" -ForegroundColor Cyan
    Write-Host "  4. Nombre del token: GamifyPy_Analysis" -ForegroundColor Cyan
    Write-Host "  5. Type: User Token" -ForegroundColor Cyan
    Write-Host "  6. Expira: 30 days (o más)" -ForegroundColor Cyan
    Write-Host "  7. Genera y COPIA el token" -ForegroundColor Cyan
    Write-Host ""
    
    $openBrowser = Read-Host "  ¿Abrir SonarQube en el navegador ahora? (S/N)"
    if ($openBrowser -eq "S" -or $openBrowser -eq "s") {
        Start-Process "http://localhost:9000/account/security"
        Write-Host ""
        Write-Host "  Navegador abierto. Genera el token y regresa aquí..." -ForegroundColor Green
        Write-Host ""
    }
    
    Write-Host "  Pega tu token aquí:" -ForegroundColor Yellow
    $token = Read-Host "  Token"
    
    if ([string]::IsNullOrWhiteSpace($token)) {
        Write-Host ""
        Write-Host "  ERROR: No se proporcionó un token válido" -ForegroundColor Red
        Write-Host "  No se puede continuar sin un token de SonarQube" -ForegroundColor Red
        Write-Host ""
        exit 1
    }
    
    # Guardar token para uso futuro
    $token | Set-Content $tokenFile
    Write-Host ""
    Write-Host "  Token guardado en: $tokenFile" -ForegroundColor Green
}

Write-Host ""
Write-Host "  Token configurado correctamente" -ForegroundColor Green
Write-Host ""

# ====================================================================
# PASO 3: EJECUTAR ANÁLISIS DE SONARQUBE (SAST)
# ====================================================================
Write-Host "[PASO 3/4] Ejecutando Análisis SAST con SonarQube" -ForegroundColor Cyan
Write-Host "-------------------------------------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "  Analizando código fuente..." -ForegroundColor Yellow
Write-Host "  • Backend (Python): backend/" -ForegroundColor Gray
Write-Host "  • Frontend (React/JS): Frontend/gamifypy/src/" -ForegroundColor Gray
Write-Host ""
Write-Host "  Esto puede tardar 2-5 minutos dependiendo del tamaño del proyecto..." -ForegroundColor Gray
Write-Host ""

$sonarStartTime = Get-Date

docker run --rm `
    --network host `
    -v "${PWD}:/usr/src" `
    sonarsource/sonar-scanner-cli:latest `
    -Dsonar.projectKey=gamifypy-owasp `
    -Dsonar.projectName="GamifyPy OWASP" `
    -Dsonar.projectVersion=1.0 `
    -Dsonar.sources=backend,Frontend/gamifypy/src `
    -Dsonar.tests=backend/test,Frontend/gamifypy/test `
    -Dsonar.exclusions="**/node_modules/**,**/__pycache__/**,**/venv/**,**/dist/**,**/build/**,**/*.min.js" `
    -Dsonar.python.version=3.8,3.9,3.10,3.11,3.12 `
    -Dsonar.host.url=http://localhost:9000 `
    -Dsonar.token=$token

$sonarEndTime = Get-Date
$sonarDuration = ($sonarEndTime - $sonarStartTime).TotalSeconds

Write-Host ""
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ANÁLISIS DE SONARQUBE COMPLETADO" -ForegroundColor Green
    Write-Host "  Tiempo: $([math]::Round($sonarDuration, 1)) segundos" -ForegroundColor Gray
} else {
    Write-Host "  ADVERTENCIA: Análisis completado con errores" -ForegroundColor Yellow
    Write-Host "  Revisa los mensajes anteriores para más detalles" -ForegroundColor Yellow
}

Write-Host ""

# ====================================================================
# PASO 4: EJECUTAR OWASP DEPENDENCY CHECK
# ====================================================================
Write-Host "[PASO 4/4] Ejecutando OWASP Dependency Check" -ForegroundColor Cyan
Write-Host "-------------------------------------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "  Analizando dependencias del proyecto..." -ForegroundColor Yellow
Write-Host "  • Backend: requirements.txt (Python)" -ForegroundColor Gray
Write-Host "  • Frontend: package.json (Node.js)" -ForegroundColor Gray
Write-Host ""
Write-Host "  NOTA: La primera vez puede tardar 15-30 minutos" -ForegroundColor Yellow
Write-Host "        (descarga base de datos de vulnerabilidades NVD)" -ForegroundColor Gray
Write-Host "  Ejecuciones posteriores serán mucho más rápidas (2-5 min)" -ForegroundColor Gray
Write-Host ""

$continuar = Read-Host "  ¿Continuar con OWASP Dependency Check? (S/N)"
if ($continuar -eq "N" -or $continuar -eq "n") {
    Write-Host ""
    Write-Host "  Análisis de dependencias omitido por el usuario" -ForegroundColor Yellow
    Write-Host "  Puedes ejecutarlo más tarde con: .\run-dependency-check.ps1" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "  Iniciando análisis de dependencias..." -ForegroundColor Yellow
    Write-Host ""
    
    # Crear directorio de reportes si no existe
    if (-Not (Test-Path "dependency-check-reports")) {
        New-Item -ItemType Directory -Path "dependency-check-reports" | Out-Null
    }
    
    $depCheckStartTime = Get-Date
    
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
        --exclude "**/dist/**" `
        --exclude "**/build/**"
    
    $depCheckEndTime = Get-Date
    $depCheckDuration = ($depCheckEndTime - $depCheckStartTime).TotalSeconds
    
    Write-Host ""
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ANÁLISIS DE DEPENDENCIAS COMPLETADO" -ForegroundColor Green
        Write-Host "  Tiempo: $([math]::Round($depCheckDuration, 1)) segundos" -ForegroundColor Gray
        Write-Host "  Reportes en: dependency-check-reports/" -ForegroundColor Cyan
    } else {
        Write-Host "  ADVERTENCIA: Análisis completado con errores" -ForegroundColor Yellow
    }
}

Write-Host ""

# ====================================================================
# RESUMEN Y RESULTADOS
# ====================================================================
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "           ANÁLISIS SAST COMPLETADO" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "RESULTADOS DISPONIBLES EN:" -ForegroundColor White
Write-Host ""
Write-Host "1. SonarQube Dashboard:" -ForegroundColor Yellow
Write-Host "   http://localhost:9000/dashboard?id=gamifypy-owasp" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Busca en SonarQube:" -ForegroundColor White
Write-Host "   • Vulnerabilidades (Vulnerabilities)" -ForegroundColor Gray
Write-Host "   • SQL Injection" -ForegroundColor Gray
Write-Host "   • Cross-Site Scripting (XSS)" -ForegroundColor Gray
Write-Host "   • Validación de entrada" -ForegroundColor Gray
Write-Host "   • Code Smells y Bugs de seguridad" -ForegroundColor Gray
Write-Host ""
Write-Host "2. OWASP Dependency Check:" -ForegroundColor Yellow
Write-Host "   dependency-check-reports/dependency-check-report.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Busca en el reporte:" -ForegroundColor White
Write-Host "   • Dependencias con CVEs conocidos" -ForegroundColor Gray
Write-Host "   • Severidad de las vulnerabilidades" -ForegroundColor Gray
Write-Host "   • Versiones recomendadas para actualizar" -ForegroundColor Gray
Write-Host ""

$abrirDashboard = Read-Host "¿Abrir SonarQube Dashboard ahora? (S/N)"
if ($abrirDashboard -eq "S" -or $abrirDashboard -eq "s") {
    Start-Process "http://localhost:9000/dashboard?id=gamifypy-owasp"
}

if (Test-Path "dependency-check-reports/dependency-check-report.html") {
    $abrirReporte = Read-Host "¿Abrir reporte de OWASP Dependency Check? (S/N)"
    if ($abrirReporte -eq "S" -or $abrirReporte -eq "s") {
        Start-Process "dependency-check-reports/dependency-check-report.html"
    }
}

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "           ANÁLISIS COMPLETADO - ÉXITO" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Siguiente paso: Analiza los reportes y documenta los hallazgos" -ForegroundColor Yellow
Write-Host ""
