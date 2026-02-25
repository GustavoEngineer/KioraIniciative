# Arquitectura de Express: Arquitectura en Capas (Layered Architecture)

No existe una "mejor" arquitectura universal, pero en el ecosistema de Node.js y Express, la **Arquitectura en Capas** es el estándar de oro para la mayoría de los proyectos.

Si vienes de otros entornos, esta estructura te resultará familiar porque aplica el principio de **Separación de Responsabilidades**. Evita que tu archivo `app.js` se convierta en un "espagueti" de 2,000 líneas.

---

## Carpetas y Archivos

### `src/config/`
Configuración global de la aplicación.

| Tipo de Archivo | Función |
|-----------------|---------|
| `.js` | Variables de entorno, configuración de base de datos, conexiones. Ej: `database.js`, `env.js` |

### `src/routes/`
Definición de endpoints y rutas HTTP.

| Tipo de Archivo | Función |
|-----------------|---------|
| `.js` | Rutas agrupadas por dominio. Solo dicen "si alguien llama a `/users`, ve al controlador de usuarios". Ej: `userRoutes.js`, `authRoutes.js` |

### `src/controllers/`
Lógica de orquestación y manejo de peticiones HTTP.

| Tipo de Archivo | Función |
|-----------------|---------|
| `.js` | Extraen datos de la petición (`req.body`, `req.params`), invocan servicios y deciden la respuesta HTTP. Ej: `userController.js`, `authController.js` |

### `src/services/`
Lógica de negocio pura de la aplicación.

| Tipo de Archivo | Función |
|-----------------|---------|
| `.js` | Aquí reside la "magia": cálculos, transformaciones, validaciones de negocio, envío de emails, etc. Los servicios no saben nada de Express. Ej: `userService.js`, `authService.js` |

### `src/models/`
Esquemas y modelos de base de datos.

| Tipo de Archivo | Función |
|-----------------|---------|
| `.js` | Representación de datos y comunicación con la BD (Mongoose, Sequelize, etc.). Ej: `User.js`, `Invoice.js` |

### `src/middlewares/`
Funciones middleware para validaciones, autenticación y manejo de errores.

| Tipo de Archivo | Función |
|-----------------|---------|
| `.js` | Validaciones de entrada, autenticación, autorización, manejo de errores global. Ej: `authMiddleware.js`, `errorHandler.js`, `validationMiddleware.js` |

### `src/utils/`
Funciones de ayuda y utilidades compartidas.

| Tipo de Archivo | Función |
|-----------------|---------|
| `.js` | Funciones puras y helpers reutilizables. Ej: `dateFormatter.js`, `passwordEncryption.js`, `validators.js` |

### `src/`
Archivos principales de la aplicación.

| Archivo | Función |
|---------|---------|
| **app.js** | Punto de entrada, configuración de middlewares y rutas |
| **server.js** (opcional) | Inicia el servidor y escucha en un puerto |

---

## Árbol Completo

```text
src/
├── config/
│   ├── database.js
│   └── env.js
│
├── routes/
│   ├── userRoutes.js
│   ├── authRoutes.js
│   └── invoiceRoutes.js
│
├── controllers/
│   ├── userController.js
│   ├── authController.js
│   └── invoiceController.js
│
├── services/
│   ├── userService.js
│   ├── authService.js
│   └── invoiceService.js
│
├── models/
│   ├── User.js
│   ├── Invoice.js
│   └── Product.js
│
├── middlewares/
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── validationMiddleware.js
│
├── utils/
│   ├── dateFormatter.js
│   ├── passwordEncryption.js
│   ├── validators.js
│   └── constants.js
│
├── app.js
└── server.js
```

---

## Flujo de Trabajo Ejemplo

Si un usuario quiere registrarse, el camino sería:

| Capa | Responsabilidad |
| --- | --- |
| **Route** | `router.post('/register', authController.signUp)` |
| **Controller** | Extrae datos del body y llama al servicio. |
| **Service** | Encripta la contraseña y guarda en la DB usando el **Model**. |
| **Middleware** | (Opcional) Verifica si el email ya existe antes de llegar al controller. |

---

## Alternativas Arquitectónicas

* **Clean Architecture:** Para proyectos masivos donde necesitas independencia total del framework y la base de datos. Más compleja pero muy robusta.
* **Microservicios:** Cuando la aplicación crece y diferentes equipos necesitan trabajar en partes independientes.

**Recomendación:** Empieza con **Arquitectura en Capas**. Es suficientemente flexible para crecer y lo suficientemente simple para evitar abstracciones innecesarias.