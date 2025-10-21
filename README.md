# GamifyPy_OWASP

Plataforma gamificada de aprendizaje de Python con enfoque en seguridad OWASP.

## 🔍 Análisis de Calidad y Seguridad

Este proyecto incluye herramientas de análisis de código y seguridad:

- **SonarQube**: Análisis estático de código para detectar bugs, vulnerabilidades y code smells
- **OWASP Dependency Check**: Identificación de vulnerabilidades conocidas (CVEs) en dependencias

### Inicio Rápido - Análisis de Código

```powershell
# 1. Iniciar SonarQube
.\start-sonarqube.ps1

# 2. Ejecutar análisis completo
.\run-full-analysis.ps1
```

📚 **Documentación completa**: 
- 📑 [INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md) - Índice completo de toda la documentación
- 🚀 [README_SONARQUBE.md](README_SONARQUBE.md) - Guía rápida de inicio
- 📖 [TUTORIAL_SONARQUBE.md](TUTORIAL_SONARQUBE.md) - Tutorial paso a paso
- 📋 [SETUP_SONARQUBE.md](SETUP_SONARQUBE.md) - Guía de configuración completa
- 🔍 [GUIA_CORRECCION.md](GUIA_CORRECCION.md) - Interpretación y corrección de hallazgos
- 📊 [RESUMEN_EJECUTIVO.md](RESUMEN_EJECUTIVO.md) - Resumen del proyecto

---

## 🛠️ Tecnologías

### Backend
- Python 3.x
- FastAPI
- SQLAlchemy
- PostgreSQL

### Frontend
- React
- Vite
- Material-UI

### Análisis de Código
- SonarQube (Docker)
- OWASP Dependency Check
- ESLint (Frontend)
