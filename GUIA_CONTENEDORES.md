# Guía Rápida - Contenedores GamifyPy

## 📦 Contenedores Incluidos

Este proyecto tiene **DOS proyectos separados** con contenedores Docker:

1. **GamifyPy_OWASP** (SonarQube) - Este proyecto
   - PostgreSQL (base de datos)
   - SonarQube (análisis de código)
   - OWASP Dependency Check (opcional, se ejecuta manualmente)

2. **Revi** (otro proyecto que tienes corriendo)

## 🚀 Scripts Disponibles

### Iniciar GamifyPy (SonarQube)
```powershell
.\start-gamifypy.ps1
```
Este script:
- ✅ Verifica que Docker esté corriendo
- ✅ Detiene contenedores anteriores de GamifyPy
- ✅ Inicia PostgreSQL y SonarQube
- ✅ NO afecta el proyecto "revi"
- ✅ NO inicia OWASP Dependency Check automáticamente

### Detener GamifyPy (SonarQube)
```powershell
.\stop-gamifypy.ps1
```

### Ver logs en tiempo real
```powershell
docker-compose logs -f
```

### Ver logs de un servicio específico
```powershell
# Ver solo logs de SonarQube
docker-compose logs -f sonarqube

# Ver solo logs de PostgreSQL
docker-compose logs -f sonarqube-db
```

## 🌐 Acceso a SonarQube

- **URL:** http://localhost:9000
- **Usuario inicial:** admin
- **Contraseña inicial:** admin
- ⏳ **Tiempo de inicio:** 1-2 minutos después de ejecutar el script

**IMPORTANTE:** En el primer login te pedirá cambiar la contraseña.

## 🔍 OWASP Dependency Check

El contenedor de OWASP Dependency Check **NO se inicia automáticamente** porque:
- Tiene un perfil `tools` en docker-compose
- Solo se ejecuta manualmente cuando lo necesites
- Puede tardar mucho tiempo (15-30 minutos la primera vez)

### Para ejecutar OWASP Dependency Check manualmente:
```powershell
# Usando el script existente
.\run-dependency-check.ps1

# O manualmente con docker-compose
docker-compose --profile tools up dependency-check
```

## 📊 Verificar Estado

### Ver contenedores corriendo
```powershell
docker ps
```

### Ver solo contenedores de GamifyPy
```powershell
docker ps --filter "name=sonarqube"
```

### Ver todos los contenedores (incluyendo detenidos)
```powershell
docker ps -a
```

## ⚠️ Solución de Problemas

### SonarQube no responde
1. Espera 1-2 minutos (tarda en iniciar)
2. Verifica los logs: `docker-compose logs -f sonarqube`
3. Reinicia los contenedores:
   ```powershell
   .\stop-gamifypy.ps1
   .\start-gamifypy.ps1
   ```

### Docker no responde
1. Reinicia Docker Desktop
2. Espera a que el ícono esté verde
3. Ejecuta nuevamente: `.\start-gamifypy.ps1`

### Error "port already in use"
Si el puerto 9000 está ocupado:
```powershell
# Ver qué está usando el puerto 9000
netstat -ano | findstr :9000
```

## 🎯 Comandos Útiles

```powershell
# Estado de contenedores
docker-compose ps

# Reiniciar un servicio específico
docker-compose restart sonarqube

# Ver uso de recursos
docker stats

# Limpiar todo (¡CUIDADO! Elimina volúmenes)
docker-compose down -v
```

## 📝 Notas

- Los datos de SonarQube se guardan en volúmenes persistentes
- Los volúmenes persisten aunque detengas los contenedores
- Solo se eliminan con `docker-compose down -v`
- El proyecto "revi" es completamente independiente y no se afecta
