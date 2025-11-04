# Script para reemplazar console.error por logger.error en archivos React
# GamifyPy OWASP - Corrección de Issues de SonarQube

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host " Corrigiendo console statements..." -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

$archivos = @(
    "Frontend\gamifypy\src\components\LevelContent.jsx",
    "Frontend\gamifypy\src\components\LessonsDialog.jsx",
    "Frontend\gamifypy\src\components\ExcerciseDialog.jsx",
    "Frontend\gamifypy\src\components\PythonLevelsMap.jsx",
    "Frontend\gamifypy\src\components\InsigniaCarousel.jsx",
    "Frontend\gamifypy\src\components\ResetPassword.jsx",
    "Frontend\gamifypy\src\view\auth\auth.jsx",
    "Frontend\gamifypy\src\view\auth\register.jsx",
    "Frontend\gamifypy\src\view\auth\ForgotPassword.jsx",
    "Frontend\gamifypy\src\view\profile\profile.jsx",
    "Frontend\gamifypy\src\view\LevelView\LevelView.jsx"
)

$contador = 0

foreach ($archivo in $archivos) {
    if (Test-Path $archivo) {
        Write-Host "Procesando: $archivo" -ForegroundColor Yellow
        
        $contenido = Get-Content $archivo -Raw -Encoding UTF8
        
        # Verificar si ya tiene el import
        if ($contenido -notmatch "import logger from") {
            # Encontrar la última línea de import
            $lines = $contenido -split "`n"
            $lastImportIndex = -1
            
            for ($i = 0; $i -lt $lines.Length; $i++) {
                if ($lines[$i] -match "^import ") {
                    $lastImportIndex = $i
                }
            }
            
            if ($lastImportIndex -ge 0) {
                # Insertar el import después del último import existente
                $lines = $lines[0..$lastImportIndex] + "import logger from '../utils/logger';" + $lines[($lastImportIndex+1)..($lines.Length-1)]
                $contenido = $lines -join "`n"
                Write-Host "  -> Agregado import de logger" -ForegroundColor Green
            }
        }
        
        # Reemplazar console.error por logger.error
        $cambios = ([regex]::Matches($contenido, "console\.error")).Count
        if ($cambios -gt 0) {
            $contenido = $contenido -replace "console\.error", "logger.error"
            Set-Content $archivo -Value $contenido -Encoding UTF8 -NoNewline
            Write-Host "  -> Reemplazados $cambios console.error" -ForegroundColor Green
            $contador += $cambios
        } else {
            Write-Host "  -> Sin console.error" -ForegroundColor Gray
        }
    } else {
        Write-Host "  -> Archivo no encontrado: $archivo" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host " Completado: $contador console.error reemplazados" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
