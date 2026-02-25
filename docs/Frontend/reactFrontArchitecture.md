# Arquitectura de React: Co-located Features & Hooks

## Carpetas y Archivos

### `src/common/`
Recursos compartidos entre dos o más módulos. Solo contiene elementos reutilizables globales.

| Subcarpeta | Tipo de Archivo | Función |
|------------|-----------------|---------|
| **components/** | `.jsx` | Componentes UI atómicos sin lógica de negocio (reutilizables). Ej: `Button.jsx`, `Input.jsx`, `Modal.jsx`, `Skeleton.jsx` |
| **hooks/** | `.js` | Custom hooks para estado global y utilidades React compartidas. Ej: `useAuth.js`, `useTheme.js`, `useLocalStorage.js` |
| **utils/** | `.js` | Funciones puras y constantes globales. Ej: `dateFormatter.js`, `validations.js`, `constants.js` |

### `src/modules/` (Features)
Capa de lógica de negocio, organizada por dominios. Cada módulo es independiente y auto-contenido.

**Estructura interna de cada módulo (ej. Dashboard/):**

| Subcarpeta | Tipo de Archivo | Función |
|------------|-----------------|---------|
| **components/** | `.jsx` | Componentes exclusivos del módulo, no reutilizables en otros. Ej: `DashboardChart.jsx` |
| **hooks/** | `.js` | Custom hooks privados del módulo, manejan estado y efectos. Ej: `useDashboardStats.js` |
| **services/** | `.js` | Funciones para llamadas API específicas del módulo. Ej: `apiDashboard.js` |
| **[ModuleName].jsx** | `.jsx` | Componente principal (contenedor) que orquesta lógica, hooks y sub-componentes |

### `src/pages/`
Puntos de entrada para las rutas. Componentes ligeros sin lógica compleja.

| Archivo | Función |
|---------|---------|
| `*.jsx` | Importan módulos completos y los envuelven en layouts. Ej: `LoginPage.jsx`, `DashboardPage.jsx` |

### `src/` (raíz)
Archivos principales de la aplicación.

| Archivo | Función |
|---------|---------|
| **App.jsx** | Orquestador de rutas y proveedores (Providers) |
| **main.jsx** | Punto de entrada al DOM, renderiza la app |
| **services/** (opcional) | Configuración global de Axios/Fetch u otros servicios compartidos |

---

## Árbol Completo

```text
src/
├── common/
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   └── Skeleton.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   └── useLocalStorage.js
│   └── utils/
│       ├── dateFormatter.js
│       ├── validations.js
│       └── constants.js
│
├── modules/
│   ├── Dashboard/
│   │   ├── components/
│   │   │   └── DashboardChart.jsx
│   │   ├── hooks/
│   │   │   └── useDashboardStats.js
│   │   ├── services/
│   │   │   └── apiDashboard.js
│   │   └── Dashboard.jsx
│   │
│   ├── Invoices/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── Invoices.jsx
│   │
│   └── [OtrosModulos]/
│
├── pages/
│   ├── HomePage.jsx
│   ├── DashboardPage.jsx
│   └── LoginPage.jsx
│
├── services/
│   └── api.config.js
│
├── App.jsx
└── main.jsx
```