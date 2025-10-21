# Guía de Configuración de SonarQube y OWASP Dependency Check

## 📋 Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Instalación de SonarQube](#instalación-de-sonarqube)
3. [Configuración del Proyecto](#configuración-del-proyecto)
4. [Ejecución del Análisis](#ejecución-del-análisis)
5. [OWASP Dependency Check](#owasp-dependency-check)
6. [Solución de Problemas](#solución-de-problemas)

---

## 🔧 Requisitos Previos

### Software Necesario
- **Docker Desktop** instalado y ejecutándose
- **PowerShell** (incluido en Windows)
- **Git** (opcional, para control de versiones)

### Verificar Docker
```powershell
docker --version
docker-compose --version
```

---

## 🚀 Instalación de SonarQube

### Paso 1: Levantar SonarQube con Docker Compose

```powershell
# Navegar al directorio del proyecto
cd C:\Users\50242\Documents\Universidad\QuintoAño\DesarrolloSeguro\GamifyPy_OWASP

# Levantar los servicios de SonarQube
docker-compose up -d sonarqube
```

### Paso 2: Verificar que SonarQube esté corriendo

```powershell
# Ver los logs de SonarQube
docker-compose logs -f sonarqube

# Verificar el estado del contenedor
docker-compose ps
```

Espera aproximadamente 1-2 minutos hasta que SonarQube esté completamente iniciado.

### Paso 3: Acceder a SonarQube

1. Abre tu navegador web
2. Ve a: **http://localhost:9000**
3. Credenciales por defecto:
   - **Usuario**: `admin`
   - **Contraseña**: `admin`
4. Te pedirá cambiar la contraseña en el primer inicio

---

## ⚙️ Configuración del Proyecto

### Paso 1: Crear Token de Autenticación

1. En SonarQube, haz clic en tu avatar (esquina superior derecha)
2. Ve a **My Account** → **Security**
3. En la sección **Generate Tokens**:
   - **Name**: `GamifyPy_OWASP_Token`
   - **Type**: `Global Analysis Token` o `Project Analysis Token`
   - **Expires in**: Selecciona una duración (ej: 30 días)
4. Haz clic en **Generate**
5. **COPIA EL TOKEN** (solo se muestra una vez)

### Paso 2: Configurar el Token en el Proyecto

Opción 1: Usando el archivo de entorno
```powershell
# Copiar el template
Copy-Item .sonarqube-env.template .sonarqube-env

# Editar el archivo .sonarqube-env con tu editor
notepad .sonarqube-env

# Reemplazar YOUR_SONARQUBE_TOKEN_HERE con tu token real
```

Opción 2: El script te lo pedirá automáticamente

### Paso 3: Verificar la Configuración

El archivo `sonar-project.properties` ya está configurado con:

```properties
sonar.projectKey=gamifypy-owasp
sonar.projectName=GamifyPy OWASP
sonar.projectVersion=1.0
sonar.sources=backend,Frontend/gamifypy/src
sonar.host.url=http://localhost:9000
```

---

## 🔍 Ejecución del Análisis

### Método 1: Usando el Script de PowerShell (Recomendado)

```powershell
# Ejecutar el análisis
.\run-sonar-analysis.ps1
```

El script:
- ✅ Verifica que SonarQube esté corriendo
- ✅ Solicita/valida el token de autenticación
- ✅ Ejecuta el análisis usando Docker
- ✅ Muestra el progreso y resultados

### Método 2: Usando Docker directamente

```powershell
docker run --rm `
    --network host `
    -v "${PWD}:/usr/src" `
    sonarsource/sonar-scanner-cli `
    -Dsonar.projectKey=gamifypy-owasp `
    -Dsonar.sources=. `
    -Dsonar.host.url=http://localhost:9000 `
    -Dsonar.token=TU_TOKEN_AQUI
```

### Método 3: Instalando SonarScanner localmente

1. Descargar SonarScanner desde: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
2. Extraer y agregar a PATH
3. Ejecutar:
```powershell
sonar-scanner -Dsonar.token=TU_TOKEN_AQUI
```

### Ver los Resultados

1. Ve a **http://localhost:9000**
2. Busca el proyecto **GamifyPy OWASP**
3. Explora:
   - 🐛 **Bugs**: Errores en el código
   - 🔒 **Vulnerabilities**: Problemas de seguridad
   - 👃 **Code Smells**: Problemas de mantenibilidad
   - 📊 **Coverage**: Cobertura de código (si está configurado)
   - 🔄 **Duplications**: Código duplicado

---

## 🛡️ OWASP Dependency Check

### ¿Qué es Dependency Check?

OWASP Dependency Check identifica vulnerabilidades conocidas (CVEs) en las dependencias de tu proyecto.

### Ejecutar el Análisis de Dependencias

```powershell
# Usando el script
.\run-dependency-check.ps1

# O directamente con Docker Compose
docker-compose run --rm dependency-check
```

### Reportes Generados

Los reportes se guardan en `dependency-check-reports/`:
- **dependency-check-report.html** - Reporte visual
- **dependency-check-report.json** - Datos en formato JSON
- **dependency-check-report.xml** - Datos en formato XML

### Interpretar los Resultados

El reporte muestra:
- 📦 **Dependencias analizadas**
- ⚠️ **Vulnerabilidades encontradas** (Critical, High, Medium, Low)
- 🔗 **CVE IDs** con enlaces a detalles
- 💡 **Recomendaciones** de actualización

---

## 🔧 Comandos Útiles

### Gestión de Docker Compose

```powershell
# Iniciar SonarQube
docker-compose up -d sonarqube

# Ver logs
docker-compose logs -f sonarqube

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (reinicio completo)
docker-compose down -v

# Ver estado de los servicios
docker-compose ps
```

### Limpieza

```powershell
# Detener todos los servicios
docker-compose down

# Eliminar volúmenes (esto borra todos los datos de SonarQube)
docker-compose down -v

# Limpiar reportes antiguos
Remove-Item -Recurse -Force dependency-check-reports
```

---

## 🐛 Solución de Problemas

### SonarQube no inicia

**Problema**: El contenedor se detiene inmediatamente

**Soluciones**:
```powershell
# Ver logs de error
docker-compose logs sonarqube

# Verificar memoria disponible (SonarQube requiere ~2GB RAM)
docker stats

# Reiniciar Docker Desktop
```

### Error de conexión al ejecutar el análisis

**Problema**: `Connection refused` o `timeout`

**Soluciones**:
```powershell
# Verificar que SonarQube esté corriendo
docker-compose ps

# Verificar la salud del servicio
docker-compose exec sonarqube curl http://localhost:9000/api/system/status

# Reiniciar el servicio
docker-compose restart sonarqube
```

### Token inválido

**Problema**: `Unauthorized` o `Invalid token`

**Soluciones**:
1. Verificar que el token esté correctamente copiado (sin espacios)
2. Generar un nuevo token en SonarQube
3. Actualizar el archivo `.sonarqube-env`

### Puerto 9000 ya en uso

**Problema**: `Port already allocated`

**Solución**:
```powershell
# Cambiar el puerto en docker-compose.yml
# En la sección sonarqube > ports, cambiar "9000:9000" a "9001:9000"
# Luego actualizar SONAR_HOST_URL a http://localhost:9001
```

### Dependency Check falla

**Problema**: Error al ejecutar OWASP Dependency Check

**Soluciones**:
```powershell
# Limpiar caché
docker volume rm dependency-check-data

# Ejecutar con más memoria
docker run --rm -m 4g ...

# Excluir directorios problemáticos
# Editar run-dependency-check.ps1 y agregar más --exclude
```

---

## 📊 Configuración Avanzada

### Integrar con CI/CD

Para GitHub Actions, GitLab CI, o Jenkins, puedes usar estos scripts como base.

### Configurar Cobertura de Código

Para Python (backend):
```powershell
# Instalar coverage
pip install coverage pytest-cov

# Ejecutar tests con cobertura
coverage run -m pytest
coverage xml

# Actualizar sonar-project.properties
# sonar.python.coverage.reportPaths=coverage.xml
```

Para JavaScript (frontend):
```powershell
# En Frontend/gamifypy
npm install --save-dev vitest @vitest/coverage-v8

# Ejecutar tests con cobertura
npm run test:coverage

# Actualizar sonar-project.properties
# sonar.javascript.lcov.reportPaths=Frontend/gamifypy/coverage/lcov.info
```

### Quality Gates Personalizados

1. En SonarQube, ve a **Quality Gates**
2. Crea un nuevo Quality Gate
3. Define condiciones (ej: Coverage > 80%, Bugs = 0)
4. Asigna el Quality Gate a tu proyecto

---

## 📚 Recursos Adicionales

- [Documentación de SonarQube](https://docs.sonarqube.org/)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [SonarScanner Documentation](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

## ✅ Checklist de Entrega

Para la evaluación del laboratorio:

- [ ] SonarQube instalado y corriendo en Docker
- [ ] Proyecto configurado en SonarQube (con projectKey, sources, token)
- [ ] Análisis ejecutado exitosamente
- [ ] Capturas de pantalla del dashboard de SonarQube
- [ ] OWASP Dependency Check ejecutado
- [ ] Reporte de vulnerabilidades de dependencias
- [ ] Documentación de hallazgos y correcciones realizadas

---

## 👥 Información del Proyecto

- **Proyecto**: GamifyPy_OWASP
- **Tecnologías**: Python (FastAPI), React (Vite)
- **SonarQube Project Key**: `gamifypy-owasp`
- **URL SonarQube**: http://localhost:9000

---

**¡Éxito con tu análisis de calidad de código! 🚀**
