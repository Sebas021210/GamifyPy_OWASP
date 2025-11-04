# Script para agregar PropTypes a componentes React
# GamifyPy OWASP - Corrección de Issues de PropTypes

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host " Agregando PropTypes a componentes..." -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Función para agregar PropTypes a un archivo
function Add-PropTypes {
    param (
        [string]$FilePath,
        [string]$PropTypesDefinition
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "  -> Archivo no encontrado: $FilePath" -ForegroundColor Red
        return
    }
    
    Write-Host "Procesando: $FilePath" -ForegroundColor Yellow
    
    $contenido = Get-Content $FilePath -Raw -Encoding UTF8
    
    # Verificar si ya tiene PropTypes
    if ($contenido -match "\.propTypes = \{") {
        Write-Host "  -> Ya tiene PropTypes" -ForegroundColor Gray
        return
    }
    
    # Agregar import de PropTypes si no existe
    if ($contenido -notmatch "import PropTypes from 'prop-types'") {
        $contenido = $contenido -replace "(import React[^;]+;)", "`$1`nimport PropTypes from 'prop-types';"
        Write-Host "  -> Agregado import PropTypes" -ForegroundColor Green
    }
    
    # Agregar la definición de PropTypes al final del archivo
    $contenido = $contenido.TrimEnd() + "`n`n" + $PropTypesDefinition + "`n"
    
    Set-Content $FilePath -Value $contenido -Encoding UTF8 -NoNewline
    Write-Host "  -> PropTypes agregados" -ForegroundColor Green
}

# ResetPassword
$resetPasswordProps = @"
ResetPassword.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};
"@
Add-PropTypes "Frontend\gamifypy\src\components\ResetPassword.jsx" $resetPasswordProps

# TermsPrivacyModal
$termsPrivacyProps = @"
TermsPrivacyModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
};
"@
Add-PropTypes "Frontend\gamifypy\src\components\TermsPrivacyModal.jsx" $termsPrivacyProps

# TokenVerificationModal
$tokenVerificationProps = @"
TokenVerificationModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleVerify: PropTypes.func.isRequired
};
"@
Add-PropTypes "Frontend\gamifypy\src\components\TokenVerificationModal.jsx" $tokenVerificationProps

Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host " Completado!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
