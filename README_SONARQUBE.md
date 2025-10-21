# 🚀 Guía Rápida - SonarQube & OWASP

## Inicio Rápido en 3 Pasos

### 1️⃣ Iniciar SonarQube
```powershell
.\start-sonarqube.ps1
```

### 2️⃣ Configurar Token
1. Abre http://localhost:9000
2. Login: `admin` / `admin` (cambia la contraseña)
3. My Account → Security → Generate Token
4. Copia el token

### 3️⃣ Ejecutar Análisis
```powershell
.\run-sonar-analysis.ps1
```

---

## 📝 Comandos Útiles

### SonarQube
```powershell
# Iniciar
docker-compose up -d sonarqube

# Ver logs
docker-compose logs -f sonarqube

# Detener
docker-compose down

# Reiniciar completamente (borra datos)
docker-compose down -v
```

### OWASP Dependency Check
```powershell
# Ejecutar análisis de dependencias
.\run-dependency-check.ps1

# Ver reportes
cd dependency-check-reports
explorer dependency-check-report.html
```

### Análisis Completo
```powershell
# Ejecutar ambos análisis
.\run-sonar-analysis.ps1
.\run-dependency-check.ps1
```

---

## 📂 Archivos Creados

| Archivo | Descripción |
|---------|-------------|
| `docker-compose.yml` | Configuración de servicios Docker |
| `sonar-project.properties` | Configuración del proyecto SonarQube |
| `start-sonarqube.ps1` | Script para iniciar SonarQube |
| `run-sonar-analysis.ps1` | Script para ejecutar análisis de código |
| `run-dependency-check.ps1` | Script para análisis de dependencias |
| `SETUP_SONARQUBE.md` | Guía detallada completa |

---

## 🎯 URLs Importantes

- **SonarQube**: http://localhost:9000
- **Documentación Completa**: Ver `SETUP_SONARQUBE.md`

---

## ⚙️ Configuración del Proyecto

**Project Key**: `gamifypy-owasp`  
**Project Name**: GamifyPy OWASP  
**Sources**: `backend`, `Frontend/gamifypy/src`  

---

## 🆘 Ayuda Rápida

**SonarQube no inicia?**
```powershell
docker-compose logs sonarqube
docker-compose restart sonarqube
```

**Error de token?**
- Regenera el token en SonarQube
- Edita `.sonarqube-env`

**Puerto ocupado?**
- Cambia el puerto en `docker-compose.yml`
- Edita `ports: "9001:9000"`

---

## 📚 Más Información

Para la guía completa y detallada, consulta: **`SETUP_SONARQUBE.md`**
