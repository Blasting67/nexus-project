# GUIA TECNICA Y REGLAS DE TRABAJO PARA AGENTES IA

Documento de directrices tecnicas, arquitectura, convenciones y limites operativos en el workspace Clever. Cualquier modelo de IA que opere en este repositorio debe cumplir estricta y obligatoriamente estas directivas.

---

## 1. REGLAS MANDATORIAS Y RESTRICCIONES CRITICAS

1. **PROHIBICION TOTAL DE EDITAR EL BACKEND Y LA BASE DE DATOS**:
   - Queda estrictamente vetado para la IA modificar, crear, alterar o borrar cualquier archivo dentro de `clever_backend/`, `clever_api/` o sus subcarpetas.
   - Queda vetado ejecutar comandos o scripts que alteren la base de datos `cleverkor_db`.
   - La arquitectura, controladores, rutas, modelos y esquemas de base de datos son de **gestion y propiedad exclusiva del usuario humano**.
   - El unico ambito de intervencion de la IA es el frontend (`clever_web/`). La IA trabaja consumiendo los endpoints que el usuario expone, sin tocar nunca el backend.

2. **PROHIBICION TOTAL DE COMENTARIOS EN EL CODIGO**:
   - Nunca incluir comentarios en ningun lenguaje de programacion o formato (TypeScript, TSX, JavaScript, CSS, JSON, HTML, Bash, etc.).
   - Queda vetado el uso de `//`, `/* */`, `/** */`, `#` y `--` dentro de archivos de codigo fuente y bloques de codigo.

3. **PROHIBICION TOTAL DE EMOJIS**:
   - Queda estrictamente vetado el uso de emojis en cualquier archivo de codigo, vista, documentacion, logs y mensajes.
   - En su lugar, utilizar exclusivamente iconos de Font Awesome mediante etiquetas `<i className="fa-solid fa-..."></i>` o `<i className="fa-regular fa-..."></i>`.

4. **SEPARACION DE ENTORNOS**:
   - `clever_web/`: Frontend SPA en React 19 + TypeScript + Vite. Unico foco de trabajo de la IA.
   - `clever_backend/`: Backend PHP 8.2+ exclusivo del usuario humano.
   - `clever_api/`: Backend Python FastAPI exclusivo del usuario humano.

---

## 2. ARQUITECTURA GENERAL DEL REPOSITORIO

```
clever/
├── clever_web/              ZONA DE TRABAJO DE LA IA (Frontend SPA)
│   ├── src/
│   │   ├── components/      Componentes visuales modulares y reutilizables
│   │   ├── config/          api.ts con URLs base y constantes de endpoints
│   │   ├── context/         PlatformContext.tsx (estado global, auth, progreso, XP)
│   │   ├── data/            Catalogos estaticos de apoyo
│   │   ├── pages/           Vistas SPA enrutadas con React Router
│   │   ├── services/        Servicios HTTP (userService.ts, api.ts)
│   │   └── types/           Definiciones e interfaces de TypeScript
│   ├── .env.example         Plantilla de variables de entorno
│   ├── .env                 Configuracion activa local (VITE_BACKEND_URL, etc.)
│   ├── package.json         Dependencias y scripts
│   └── vite.config.ts       Configuracion de Vite
│
├── clever_backend/          PROPIEDAD EXCLUSIVA DEL USUARIO (No tocar)
├── clever_api/              PROPIEDAD EXCLUSIVA DEL USUARIO (No tocar)
├── prototipo/               Prototipos estaticos de referencia
├── AGENTS.md                Reglas y directivas para la IA
└── README.md                Guia general del repositorio
```

---

## 3. CONVENCIONES DE CODIGO Y NOMENCLATURA EN EL FRONTEND

### A. Idioma en el Codigo
- **Identificadores de programacion**: En ingles. Variables, funciones, hooks, interfaces, componentes y props tecnicas deben nombrarse en ingles (`userId`, `handleSubmit`, `isSubmitting`, `fetchData`, `usePlatform`).
- **Textos de cara al usuario final**: En espanol. Formularios, modales, alertas, textos de botones, mensajes de toasts y encabezados deben redactarse en espanol formal y claro.
- **Tipado de contratos**: Coincidir con los campos JSON del backend (`id`, `name`, `username`, `email`, `role`, `is_active`, `avatar`, `created_at`).

### B. Formato de Nombres (Casing)
- **Variables y funciones**: `camelCase` (ejemplo: `isSubmitting`, `showToast`, `handleLogin`).
- **Interfaces y Types**: `PascalCase` (ejemplo: `UserProfile`, `BackendUser`, `ToastItem`).
- **Componentes y Paginas**: `PascalCase.tsx` (ejemplo: `RegisterPage.tsx`, `LoginPage.tsx`, `Navbar.tsx`).
- **Constantes de configuracion**: `UPPER_SNAKE_CASE` (ejemplo: `BACKEND_URL`, `USER_ENDPOINTS`).

---

## 4. REACT ROUTER Y NAVEGACION SPA

### A. Estructura de Rutas
- Todas las rutas se concentran en `clever_web/src/App.tsx`.
- Se utiliza `react-router-dom` con los componentes `BrowserRouter`, `Routes` y `Route`.
- Cada ruta enlaza a una pagina de `clever_web/src/pages/`.

### B. Patron de Navegacion
- **Navegacion declarativa en JSX**:
```tsx
import { Link } from 'react-router-dom'

<Link to="/register" className="text-[var(--primary)] hover:underline">
  Registrarse
</Link>
```
- **Navegacion imperativa en logica**:
```tsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()
navigate('/')
```

---

## 5. COMO CONECTA LA IA EL FRONTEND CON EL BACKEND DEL USUARIO

Dado que el backend lo gestiona exclusivamente el usuario humano, la IA unicamente consume las APIs existentes siguiendo este flujo estricto de 4 pasos dentro de `clever_web/`:

### Paso 1: Registrar el Endpoint en `src/config/api.ts`
- Utilizar `BACKEND_URL` para componer la URL:
```ts
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'

export const USER_ENDPOINTS = {
  RECURSO: `${BACKEND_URL}/api/recurso`,
}
```

### Paso 2: Crear o Extender el Servicio en `src/services/`
- Definir la interfaz TypeScript con los datos esperados.
- Realizar la peticion con `fetch` enviando cabeceras `Content-Type: application/json` y `Accept: application/json`.
- Validar si la respuesta fue exitosa y extraer el mensaje de error emitido por el backend para lanzarlo como `Error`:
```ts
const res = await fetch(USER_ENDPOINTS.RECURSO, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify(payload),
})
```

### Paso 3: Integrar en el Contexto Global (`src/context/PlatformContext.tsx`)
- Enlazar la llamada del servicio mediante funciones asincronas (`async/await`).
- Actualizar el estado de React (`user`, etc.) con la informacion devuelta por el backend.
- Notificar el resultado mediante el sistema de toasts (`showToast(mensaje, 'success' | 'error')`).

### Paso 4: Implementar en Vistas y Formularios (`src/pages/`)
- Declarar el estado local de envio:
  `const [isSubmitting, setIsSubmitting] = useState(false)`
- Deshabilitar inputs y botones durante la peticion (`disabled={isSubmitting}`).
- Mostrar animacion con Font Awesome en botones de accion:
  `<i className="fa-solid fa-circle-notch fa-spin mr-1.5"></i>`
- Capturar y mostrar errores visualmente.

---

## 6. EJECUCION DEL FRONTEND

```bash
cd clever_web
pnpm dev
```
Acceso en navegador: `http://localhost:5173`
