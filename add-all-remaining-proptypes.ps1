#!/usr/bin/env pwsh
# Script para agregar PropTypes a los 4 componentes restantes
# GamifyPy - Fase 2 OWASP

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  Agregar PropTypes - Componentes Restantes" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

$componentes = @(
    @{
        Archivo = "Frontend/gamifypy/src/components/LevelContent.jsx"
        Nombre = "LevelContent"
        Issues = "~20-25"
    },
    @{
        Archivo = "Frontend/gamifypy/src/components/PythonLevelsMap.jsx"
        Nombre = "PythonLevelsMap"
        Issues = "~15-20"
    },
    @{
        Archivo = "Frontend/gamifypy/src/components/InsigniaCarousel.jsx"
        Nombre = "InsigniaCarousel"
        Issues = "~5-10"
    },
    @{
        Archivo = "Frontend/gamifypy/src/view/auth/GoogleCallback.jsx"
        Nombre = "GoogleCallback"
        Issues = "~2-3"
    }
)

Write-Host "Componentes pendientes:" -ForegroundColor Yellow
Write-Host ""
foreach ($comp in $componentes) {
    $existe = Test-Path $comp.Archivo
    $status = if ($existe) { "✓ ENCONTRADO" } else { "✗ NO ENCONTRADO" }
    $color = if ($existe) { "Green" } else { "Red" }
    
    Write-Host "  [$status] " -ForegroundColor $color -NoNewline
    Write-Host "$($comp.Nombre) " -NoNewline
    Write-Host "($($comp.Issues) issues esperados)" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  Total esperado: ~40-50 issues resueltos" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NOTA: Copilot agregará los PropTypes uno por uno" -ForegroundColor Yellow
Write-Host "      Este proceso puede tardar 5-10 minutos" -ForegroundColor Yellow
Write-Host ""
