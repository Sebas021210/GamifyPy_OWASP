# 🔗 Integración OWASP Dependency Check con SonarQube

## 📋 Métodos de Integración

---

## Método 1: Plugin de SonarQube (RECOMENDADO)

### Paso 1: Instalar Plugin
1. Accede a SonarQube: http://localhost:9000
2. Ve a **Administration** → **Marketplace**
3. Busca "**Dependency-Check**"
4. Instala el plugin **Dependency-Check Plugin**
5. Reinicia SonarQube

### Paso 2: Configurar en el Proyecto
Agrega a `sonar-project.properties`:
```properties
# OWASP Dependency Check
sonar.dependencyCheck.reportPath=../../dependency-check-reports/dependency-check-report.xml
sonar.dependencyCheck.htmlReportPath=../../dependency-check-reports/dependency-check-report.html
```

### Paso 3: Ejecutar Análisis
```powershell
# 1. Ejecutar Dependency Check
.\run-dependency-check.ps1

# 2. Ejecutar SonarQube scan
cd Frontend\gamifypy
npm run sonar
```

---

## Método 2: Importar Reporte SARIF

### Paso 1: Generar Reporte SARIF
El script `run-dependency-check.ps1` ya genera el reporte SARIF:
```
dependency-check-reports/dependency-check-report.sarif
```

### Paso 2: Configurar SonarQube
Agrega a `sonar-project.properties`:
```properties
# External Issues
sonar.externalIssuesReportPaths=../../dependency-check-reports/dependency-check-report.sarif
```

### Paso 3: Ejecutar Scan
```powershell
cd Frontend\gamifypy
npm run sonar
```

---

## Método 3: Script Automatizado (MÁS FÁCIL)

### Crear Script Integrado

Ya tienes `run-frontend-analysis.ps1` que ejecuta todo automáticamente:

```powershell
.\run-frontend-analysis.ps1
```

Este script:
1. ✅ Ejecuta tests con coverage
2. ✅ Ejecuta análisis de SonarQube
3. ✅ Ejecuta OWASP Dependency Check
4. ✅ Integra todos los reportes

---

## 📊 Verificar Integración

### En SonarQube Dashboard

1. **Ve a tu proyecto**: http://localhost:9000/dashboard?id=gamifypy-owasp-frontend

2. **Verifica las pestañas**:
   - **Issues** → Deberías ver issues de dependencias
   - **Security** → Vulnerabilidades detectadas
   - **Measures** → Métricas de seguridad

3. **Busca "CVE-"**: Si ves issues con CVE-XXXX-XXXX, ¡la integración funcionó! ✅

---

## 🔧 Configuración Avanzada

### Frontend/gamifypy/sonar-project.properties

```properties
# Configuración de SonarQube para el Frontend (React/Vite)

sonar.projectKey=gamifypy-owasp-frontend
sonar.projectName=GamifyPy OWASP - Frontend
sonar.projectVersion=2.0

# Directorios del proyecto frontend
sonar.sources=src
sonar.tests=src/test

# Codificación
sonar.sourceEncoding=UTF-8

# Exclusiones
sonar.exclusions=\
  node_modules/**,\
  dist/**,\
  build/**,\
  coverage/**,\
  **/*.config.js,\
  vite.config.js,\
  eslint.config.js,\
  src/test/**

# Exclusiones de cobertura
sonar.coverage.exclusions=\
  src/test/**,\
  **/*.config.js,\
  **/*.test.js,\
  **/*.test.jsx

# Reporte de cobertura de código
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# 🔒 OWASP Dependency Check Integration
# Método 1: Si tienes el plugin instalado
sonar.dependencyCheck.reportPath=../../dependency-check-reports/dependency-check-report.xml
sonar.dependencyCheck.htmlReportPath=../../dependency-check-reports/dependency-check-report.html

# Método 2: Usando external issues (SARIF)
sonar.externalIssuesReportPaths=../../dependency-check-reports/dependency-check-report.sarif

# Configuración del servidor
sonar.host.url=http://localhost:9000

# Token (reemplazar con tu token)
# sonar.token=YOUR_TOKEN_HERE
```

---

## 🎯 Workflow Completo

### Opción A: Todo Automatizado (RECOMENDADO)

```powershell
# Un solo comando ejecuta todo
.\run-frontend-analysis.ps1
```

### Opción B: Paso a Paso

```powershell
# 1. Dependency Check
.\run-dependency-check.ps1

# 2. Tests + Coverage
.\run-frontend-tests.ps1

# 3. SonarQube Scan
cd Frontend\gamifypy
npm run sonar
cd ..\..

# 4. Verificar en SonarQube
start http://localhost:9000/dashboard?id=gamifypy-owasp-frontend
```

---

## 📈 Ejemplo de Salida Esperada

### En SonarQube Issues Tab

Deberías ver issues como:

```
🔴 CVE-2024-XXXX: Vulnerability in react-dom@19.1.1
   Severity: High
   Type: Vulnerability
   CVSS Score: 7.5
   
🟡 CVE-2023-XXXX: Vulnerability in some-package@1.0.0
   Severity: Medium
   Type: Vulnerability
   CVSS Score: 5.3
```

### En Security Hotspots

```
⚠️ Use of vulnerable dependency: package-name
   Review and update to safe version
```

---

## 🔍 Interpretar Resultados

### Vulnerabilidades Detectadas

1. **Critical/High**: Actualizar inmediatamente
2. **Medium**: Planificar actualización
3. **Low**: Revisar y documentar
4. **False Positives**: Marcar como "Won't Fix" con justificación

### Ejemplo de Acción

```json
// Si Dependency Check reporta:
{
  "package": "react-scripts@5.0.0",
  "vulnerability": "CVE-2023-XXXX",
  "severity": "HIGH"
}

// Acción:
// 1. Verificar si hay versión segura
npm update react-scripts

// 2. Si no hay fix, documentar
// 3. Marcar en SonarQube si es false positive
```

---

## ⚠️ Problemas Comunes

### 1. Plugin No Se Instala

**Solución**: Usar Método 2 (SARIF) que no requiere plugin

### 2. Reportes No Se Ven en SonarQube

**Verificar**:
```powershell
# ¿Existe el reporte?
dir dependency-check-reports

# ¿La ruta en sonar-project.properties es correcta?
# Debe ser relativa al directorio donde ejecutas npm run sonar
```

### 3. Demasiadas Vulnerabilidades

**Es normal en node_modules**. Opciones:
- Actualizar dependencias: `npm update`
- Revisar con `npm audit`
- Usar herramientas como `npm-check-updates`

---

## 📊 Dashboard Unificado

### Crear Vista Consolidada en SonarQube

1. **Overview Tab**
   - Code Coverage
   - SAST Issues
   - Dependency Vulnerabilities

2. **Issues Tab**
   - Filtrar por tipo
   - Priorizar por severidad

3. **Security Tab**
   - Security Hotspots
   - CVEs detectados

---

## 🎯 Métricas de Éxito

### Antes
- ❌ No se detectaban vulnerabilidades de dependencias
- ❌ Análisis manual de `npm audit`

### Después
- ✅ Detección automática de CVEs
- ✅ Integración con SonarQube
- ✅ Reportes visuales en dashboard
- ✅ Tracking histórico de vulnerabilidades

---

## 📚 Recursos

- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [SonarQube Plugin](https://github.com/dependency-check/dependency-check-sonar-plugin)
- [SARIF Format](https://sarifweb.azurewebsites.net/)

---

## 🎉 Validación Final

### Checklist de Integración Exitosa

- [ ] Dependency Check ejecuta sin errores
- [ ] Reportes generados en `/dependency-check-reports/`
- [ ] SonarQube scan incluye dependency issues
- [ ] Dashboard muestra vulnerabilidades de dependencias
- [ ] Issues tienen referencias a CVEs

**¡Si todos están marcados, la integración está completa!** ✅
