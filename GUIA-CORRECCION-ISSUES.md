# 🔧 Guía Práctica: Corrección de Issues de SonarQube

## 📋 Issues Más Comunes y Cómo Corregirlos

---

## 1. 🔴 Cognitive Complexity (CRÍTICO)

### Problema
```
Refactor this function to reduce its Cognitive Complexity from 19 to the 15 allowed.
```

### ❌ Código Problemático
```jsx
function handleFormSubmit(data) {
  if (data.email) {
    if (validateEmail(data.email)) {
      if (data.password) {
        if (data.password.length >= 8) {
          if (data.terms) {
            if (checkUserExists(data.email)) {
              // ... más lógica anidada
            }
          }
        }
      }
    }
  }
}
```

### ✅ Código Corregido
```jsx
// Opción 1: Early Returns
function handleFormSubmit(data) {
  if (!data.email) return { error: 'Email required' };
  if (!validateEmail(data.email)) return { error: 'Invalid email' };
  if (!data.password) return { error: 'Password required' };
  if (data.password.length < 8) return { error: 'Password too short' };
  if (!data.terms) return { error: 'Accept terms' };
  
  return processRegistration(data);
}

// Opción 2: Extraer Funciones
function validateFormData(data) {
  return data.email && 
         validateEmail(data.email) && 
         data.password?.length >= 8 && 
         data.terms;
}

function handleFormSubmit(data) {
  if (!validateFormData(data)) {
    return { error: 'Invalid form data' };
  }
  return processRegistration(data);
}
```

---

## 2. 🟡 Fragment Redundante

### Problema
```
A fragment with only one child is redundant.
```

### ❌ Código Problemático
```jsx
export default function LoadingBackdrop({ loading }) {
  return (
    <>
      <Backdrop open={loading}>
        <CircularProgress />
      </Backdrop>
    </>
  );
}
```

### ✅ Código Corregido
```jsx
export default function LoadingBackdrop({ loading }) {
  return (
    <Backdrop open={loading}>
      <CircularProgress />
    </Backdrop>
  );
}
```

---

## 3. 🟡 Props Validation Missing

### Problema
```
'open' is missing in props validation
'updateEjercicios' is missing in props validation
```

### ❌ Código Problemático
```jsx
export default function ExerciseDialog({ open, updateEjercicios, lessonId }) {
  // ... código del componente
}
```

### ✅ Código Corregido
```jsx
import PropTypes from 'prop-types';

function ExerciseDialog({ open, updateEjercicios, lessonId }) {
  // ... código del componente
}

ExerciseDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  updateEjercicios: PropTypes.func.isRequired,
  lessonId: PropTypes.number.isRequired
};

export default ExerciseDialog;
```

### Tipos Comunes de PropTypes
```jsx
PropTypes.bool          // Booleano
PropTypes.string        // String
PropTypes.number        // Número
PropTypes.func          // Función
PropTypes.array         // Array
PropTypes.object        // Objeto
PropTypes.node          // Cualquier cosa que se pueda renderizar
PropTypes.element       // Elemento React

// Opcionales (no required)
PropTypes.string        // Puede ser undefined
PropTypes.string.isRequired  // Debe estar presente

// Arrays y Objetos específicos
PropTypes.arrayOf(PropTypes.string)
PropTypes.objectOf(PropTypes.number)
PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string
})

// Múltiples tipos
PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number
])

// Valores específicos
PropTypes.oneOf(['small', 'medium', 'large'])
```

---

## 4. 🟠 Console Statements

### Problema
```
Remove this console statement.
```

### ❌ Código Problemático
```jsx
useEffect(() => {
  fetchData()
    .then(data => {
      console.log('Data received:', data);
      setData(data);
    })
    .catch(err => {
      console.error('Error:', err);
    });
}, []);
```

### ✅ Código Corregido

**Opción 1: Remover completamente**
```jsx
useEffect(() => {
  fetchData()
    .then(data => {
      setData(data);
    })
    .catch(err => {
      // Manejar error apropiadamente
      setError(err.message);
    });
}, []);
```

**Opción 2: Logger condicional (desarrollo)**
```jsx
// utils/logger.js
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args) => {
    if (isDev) console.log(...args);
  },
  error: (...args) => {
    console.error(...args); // Errores siempre se loggean
  },
  warn: (...args) => {
    if (isDev) console.warn(...args);
  }
};

// En el componente
import { logger } from './utils/logger';

useEffect(() => {
  fetchData()
    .then(data => {
      logger.log('Data received:', data);
      setData(data);
    })
    .catch(err => {
      logger.error('Error:', err);
      setError(err.message);
    });
}, []);
```

---

## 5. 🟡 Unused Variables

### Problema
```
'container' is assigned a value but never used.
```

### ❌ Código Problemático
```jsx
it('should render component', () => {
  const { container } = render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### ✅ Código Corregido

**Opción 1: Remover variable**
```jsx
it('should render component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

**Opción 2: Usar la variable**
```jsx
it('should render component', () => {
  const { container } = render(<MyComponent />);
  expect(container.querySelector('.my-class')).toBeInTheDocument();
});
```

**Opción 3: Prefijo con guión bajo (si necesitas mantenerla)**
```jsx
it('should render component', () => {
  const { container: _container } = render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

---

## 6. 🟡 Duplicate Keys in JSX

### Problema
```
Elements in iteration should have a unique "key" prop.
```

### ❌ Código Problemático
```jsx
function ItemList({ items }) {
  return (
    <div>
      {items.map((item, index) => (
        <div>{item.name}</div>  {/* Sin key */}
      ))}
    </div>
  );
}
```

### ✅ Código Corregido
```jsx
function ItemList({ items }) {
  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

// Si no hay ID único, usar index como último recurso
function ItemList({ items }) {
  return (
    <div>
      {items.map((item, index) => (
        <div key={`item-${index}`}>{item.name}</div>
      ))}
    </div>
  );
}
```

---

## 7. 🟡 Unnecessary else/else if

### Problema
```
Remove this unnecessary 'else' after 'return'.
```

### ❌ Código Problemático
```jsx
function getStatus(value) {
  if (value > 100) {
    return 'high';
  } else if (value > 50) {
    return 'medium';
  } else {
    return 'low';
  }
}
```

### ✅ Código Corregido
```jsx
function getStatus(value) {
  if (value > 100) {
    return 'high';
  }
  if (value > 50) {
    return 'medium';
  }
  return 'low';
}
```

---

## 8. 🟡 Empty Catch Block

### Problema
```
Handle this error or remove the try-catch block.
```

### ❌ Código Problemático
```jsx
try {
  JSON.parse(data);
} catch (err) {
  // vacio
}
```

### ✅ Código Corregido
```jsx
// Opción 1: Manejar el error
try {
  return JSON.parse(data);
} catch (err) {
  console.error('Failed to parse JSON:', err);
  return null;
}

// Opción 2: Propagar el error
try {
  return JSON.parse(data);
} catch (err) {
  throw new Error(`Invalid JSON: ${err.message}`);
}

// Opción 3: Logger y valor por defecto
try {
  return JSON.parse(data);
} catch (err) {
  logger.error('JSON parse error:', err);
  return {};
}
```

---

## 9. 🟡 Consistent Return

### Problema
```
This function should return a value in all code paths.
```

### ❌ Código Problemático
```jsx
function processData(data) {
  if (data.isValid) {
    return processValidData(data);
  }
  // No return en el else path
}
```

### ✅ Código Corregido
```jsx
function processData(data) {
  if (data.isValid) {
    return processValidData(data);
  }
  return null;  // Retorno explícito
}

// O mejor aún
function processData(data) {
  if (!data.isValid) {
    return null;
  }
  return processValidData(data);
}
```

---

## 10. 🟡 Magic Numbers

### Problema
```
Extract this magic number into a constant.
```

### ❌ Código Problemático
```jsx
function validatePassword(password) {
  return password.length >= 8;
}

function setTimeout() {
  return 14 * 60 * 1000;
}
```

### ✅ Código Corregido
```jsx
// constants.js
export const MIN_PASSWORD_LENGTH = 8;
export const TOKEN_REFRESH_INTERVAL_MS = 14 * 60 * 1000;

// En el componente
import { MIN_PASSWORD_LENGTH, TOKEN_REFRESH_INTERVAL_MS } from './constants';

function validatePassword(password) {
  return password.length >= MIN_PASSWORD_LENGTH;
}

function setupTokenRefresh() {
  setInterval(refreshToken, TOKEN_REFRESH_INTERVAL_MS);
}
```

---

## 📊 Checklist de Corrección

### Antes de Corregir
- [ ] Identificar el issue en SonarQube
- [ ] Entender el problema
- [ ] Leer la documentación del issue
- [ ] Verificar el contexto del código

### Durante la Corrección
- [ ] Aplicar la solución apropiada
- [ ] Ejecutar tests: `npm run test`
- [ ] Verificar que no se rompa nada
- [ ] Hacer commit de cambios individuales

### Después de Corregir
- [ ] Ejecutar analysis: `npm run sonar`
- [ ] Verificar que el issue desapareció
- [ ] Documentar cambios importantes

---

## 🎯 Priorización de Issues

### Prioridad ALTA (Corregir primero)
1. 🔴 Bugs
2. 🔴 Vulnerabilidades
3. 🟠 Code Smells críticos (Cognitive Complexity)

### Prioridad MEDIA
4. 🟡 Props validation
5. 🟡 Console statements
6. 🟡 Fragmentos redundantes

### Prioridad BAJA
7. 🟢 Code style
8. 🟢 Comentarios

---

## 💡 Tips

1. **No corrijas todo de una vez**: Hazlo por categorías
2. **Ejecuta tests después de cada cambio**: `npm run test`
3. **Verifica en SonarQube**: Algunos issues pueden desaparecer juntos
4. **Documenta cambios importantes**: Especialmente en lógica compleja
5. **Pregunta si no entiendes**: Mejor entender que romper código

---

## 🔗 Referencias

- [SonarQube JavaScript Rules](https://rules.sonarsource.com/javascript)
- [React PropTypes](https://react.dev/reference/react/Component#static-proptypes)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)
