# 📖 Tutorial Paso a Paso - Configuración de SonarQube

## 🎯 Objetivo
Configurar y ejecutar SonarQube con OWASP Dependency Check para el proyecto GamifyPy_OWASP.

---

## ✅ Pre-requisitos

Antes de comenzar, verifica que tengas:

- [ ] Docker Desktop instalado y funcionando
- [ ] PowerShell (incluido en Windows)
- [ ] Al menos 4GB de RAM disponible
- [ ] Conexión a Internet (para descargar imágenes Docker)

### Verificar Docker

```powershell
# Abrir PowerShell y ejecutar:
docker --version
docker-compose --version
```

Si ves las versiones, estás listo para continuar.

---

## 📝 Paso 1: Iniciar SonarQube

### Opción A: Script Automático (Recomendado)

```powershell
# Navegar al directorio del proyecto
cd C:\Users\50242\Documents\Universidad\QuintoAño\DesarrolloSeguro\GamifyPy_OWASP

# Ejecutar el script de inicio
.\start-sonarqube.ps1
```

El script te guiará automáticamente.

### Opción B: Manual

```powershell
# Iniciar servicios
docker-compose up -d sonarqube

# Ver el progreso
docker-compose logs -f sonarqube

# Esperar hasta ver: "SonarQube is operational"
# Presionar Ctrl+C para salir de los logs
```

### ✅ Verificación

1. Abre tu navegador
2. Ve a: `http://localhost:9000`
3. Deberías ver la página de login de SonarQube

---

## 🔐 Paso 2: Configuración Inicial de SonarQube

### 2.1 Primer Login

1. **Usuario**: `admin`
2. **Contraseña**: `admin`
3. Click en "Log in"

### 2.2 Cambiar Contraseña

SonarQube te pedirá cambiar la contraseña:

1. **Old password**: `admin`
2. **New password**: Elige una contraseña segura (ej: `Admin123!`)
3. **Confirm password**: Repite la contraseña
4. Click en "Update"

**⚠️ IMPORTANTE**: Guarda esta contraseña, la necesitarás después.

### 2.3 Crear Token de Autenticación

1. Click en tu avatar (esquina superior derecha)
2. Selecciona "**My Account**"
3. Click en la pestaña "**Security**"
4. En "**Generate Tokens**":
   - **Name**: `GamifyPy_Token`
   - **Type**: `Global Analysis Token`
   - **Expires in**: `90 days` (o el período que prefieras)
5. Click en "**Generate**"

### 2.4 Copiar el Token

```
⚠️ IMPORTANTE: El token se muestra solo UNA VEZ
```

Ejemplo de token:
```
squ_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

1. **COPIA EL TOKEN COMPLETO**
2. Guárdalo temporalmente en un lugar seguro (Notepad)

---

## ⚙️ Paso 3: Configurar el Proyecto

### 3.1 Guardar el Token en el Proyecto

```powershell
# Copiar el template
Copy-Item .sonarqube-env.template .sonarqube-env

# Abrir el archivo con Notepad
notepad .sonarqube-env
```

### 3.2 Editar el Archivo

Reemplaza `YOUR_SONARQUBE_TOKEN_HERE` con tu token real:

**Antes:**
```
SONAR_TOKEN=YOUR_SONARQUBE_TOKEN_HERE
```

**Después:**
```
SONAR_TOKEN=squ_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

Guarda y cierra el archivo (Ctrl+S, luego cierra Notepad).

### 3.3 Verificar la Configuración

```powershell
# Ver el contenido del archivo (sin mostrar el token)
Get-Content .sonarqube-env
```

---

## 🚀 Paso 4: Ejecutar el Análisis

### 4.1 Análisis de SonarQube

```powershell
# Ejecutar el script de análisis
.\run-sonar-analysis.ps1
```

El script:
- ✅ Verificará que SonarQube esté corriendo
- ✅ Usará el token guardado
- ✅ Ejecutará el análisis usando Docker
- ✅ Te mostrará el progreso

**Tiempo estimado**: 2-5 minutos

### 4.2 Ver los Resultados en SonarQube

1. Ve a `http://localhost:9000`
2. Click en "**Projects**"
3. Deberías ver "**GamifyPy OWASP**"
4. Click en el proyecto para ver:
   - 🐛 Bugs encontrados
   - 🔒 Vulnerabilidades de seguridad
   - 👃 Code Smells (problemas de mantenibilidad)
   - 📊 Métricas de calidad

---

## 🛡️ Paso 5: OWASP Dependency Check

### 5.1 Ejecutar el Análisis de Dependencias

```powershell
# Ejecutar el script
.\run-dependency-check.ps1
```

**Tiempo estimado**: 5-15 minutos (primera ejecución)

La primera vez descargará la base de datos de CVEs (vulnerabilidades conocidas).

### 5.2 Ver el Reporte

El script te preguntará si quieres abrir el reporte HTML.

Si no, puedes abrirlo manualmente:

```powershell
# Abrir el reporte HTML
explorer dependency-check-reports\dependency-check-report.html
```

El reporte muestra:
- 📦 Dependencias analizadas
- ⚠️ Vulnerabilidades encontradas (Critical, High, Medium, Low)
- 🔗 CVE IDs con enlaces a información detallada
- 💡 Recomendaciones de actualización

---

## 🎁 Paso 6: Análisis Completo (Todo-en-Uno)

### Ejecutar Ambos Análisis a la Vez

```powershell
# Script que ejecuta todo
.\run-full-analysis.ps1
```

Este script:
1. ✅ Inicia SonarQube (si no está corriendo)
2. ✅ Ejecuta OWASP Dependency Check
3. ✅ Ejecuta análisis de SonarQube
4. ✅ Te muestra un resumen
5. ✅ Te ofrece abrir los reportes

---

## 📊 Interpretando los Resultados

### SonarQube Dashboard

**Bugs** 🐛
- Errores en el código que pueden causar fallos
- **Prioridad**: Corregir primero los críticos

**Vulnerabilities** 🔒
- Problemas de seguridad
- **Acción**: Revisar TODOS, especialmente los críticos

**Code Smells** 👃
- Problemas de mantenibilidad
- **Objetivo**: Reducir deuda técnica

**Coverage** 📈
- Porcentaje de código cubierto por tests
- **Meta**: >80% de cobertura

**Duplications** 🔄
- Código duplicado
- **Acción**: Refactorizar para reutilizar

### OWASP Dependency Check

**Severity Levels**:

| Nivel | Descripción | Acción |
|-------|-------------|--------|
| 🔴 **Critical** | Vulnerabilidad extremadamente grave | Actualizar INMEDIATAMENTE |
| 🟠 **High** | Vulnerabilidad grave | Actualizar urgente |
| 🟡 **Medium** | Vulnerabilidad moderada | Planificar actualización |
| 🟢 **Low** | Vulnerabilidad menor | Revisar y considerar |

---

## 🎯 Checklist de Evaluación

Para cumplir con los requisitos del laboratorio:

### Instalación y Configuración (10%)
- [ ] SonarQube instalado con Docker
- [ ] Servicios corriendo correctamente
- [ ] Acceso a la interfaz web funcionando

### Configuración del Proyecto (10%)
- [ ] Proyecto cargado en SonarQube
- [ ] `sonar-project.properties` configurado con:
  - [ ] `projectKey`: gamifypy-owasp
  - [ ] `sources`: backend, Frontend/gamifypy/src
  - [ ] `token`: Generado y configurado
- [ ] Análisis ejecutado exitosamente

### Entregables Sugeridos
- [ ] Capturas de pantalla del dashboard de SonarQube
- [ ] Reporte HTML de OWASP Dependency Check
- [ ] Documento explicando hallazgos principales
- [ ] Plan de acción para corregir issues críticos

---

## 🔧 Comandos de Gestión

### Ver Estado de Servicios

```powershell
# Ver servicios corriendo
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f sonarqube

# Ver uso de recursos
docker stats
```

### Reiniciar Servicios

```powershell
# Reiniciar SonarQube
docker-compose restart sonarqube

# Reiniciar todo
docker-compose restart
```

### Detener Servicios

```powershell
# Detener servicios (conserva datos)
docker-compose down

# Detener y eliminar datos (reinicio completo)
docker-compose down -v
```

### Limpiar Espacio

```powershell
# Eliminar reportes antiguos
Remove-Item -Recurse -Force dependency-check-reports

# Limpiar imágenes Docker no usadas
docker system prune -a
```

---

## 🆘 Solución de Problemas Comunes

### Problema 1: "Docker no está corriendo"

**Solución**:
1. Abre Docker Desktop
2. Espera a que muestre "Docker Desktop is running"
3. Vuelve a ejecutar el comando

### Problema 2: "Puerto 9000 ya en uso"

**Solución**:
```powershell
# Encontrar qué está usando el puerto
netstat -ano | findstr :9000

# Detener el proceso o cambiar el puerto en docker-compose.yml
```

### Problema 3: "SonarQube no responde"

**Solución**:
```powershell
# Ver logs para diagnosticar
docker-compose logs sonarqube | Select-String -Pattern "error"

# Reiniciar el servicio
docker-compose restart sonarqube

# Si persiste, reiniciar completamente
docker-compose down -v
docker-compose up -d sonarqube
```

### Problema 4: "Token inválido"

**Solución**:
1. Verifica que el token esté correctamente copiado (sin espacios)
2. Genera un nuevo token en SonarQube
3. Actualiza `.sonarqube-env`
4. Vuelve a ejecutar el análisis

### Problema 5: "Dependency Check tarda mucho"

**Explicación**: La primera ejecución descarga una base de datos grande (~500MB)

**Solución**:
- Espera pacientemente (puede tardar 10-20 minutos la primera vez)
- Las siguientes ejecuciones serán más rápidas (2-5 minutos)

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [SonarQube Docs](https://docs.sonarqube.org/)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [Docker Compose](https://docs.docker.com/compose/)

### Videos Tutorial
- Buscar en YouTube: "SonarQube Docker Tutorial"
- Buscar: "OWASP Dependency Check Tutorial"

### Ayuda en el Proyecto
- Ver: `SETUP_SONARQUBE.md` - Guía detallada completa
- Ver: `README_SONARQUBE.md` - Referencia rápida

---

## 🎓 Consejos para el Laboratorio

1. **Toma capturas de pantalla** en cada paso
2. **Documenta los hallazgos** principales
3. **Crea un plan de acción** para corregir issues críticos
4. **Compara antes/después** si corriges algunos problemas
5. **Incluye métricas** (número de bugs, vulnerabilidades, etc.)

---

## ✨ Siguiente Nivel

Una vez que tengas todo funcionando:

1. **Configura Quality Gates** personalizados en SonarQube
2. **Integra con GitHub Actions** para CI/CD
3. **Configura cobertura de código** con pytest y vitest
4. **Establece reglas** para bloquear código de baja calidad

---

**¡Éxito con tu laboratorio! 🚀**

Si tienes problemas, revisa la sección de solución de problemas o consulta `SETUP_SONARQUBE.md`.
