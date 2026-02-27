# Documentación: API Endpoints Kiora V1

Esta documentación describe todos los endpoints disponibles en la API de Kiora. Cada uno respeta las políticas de **Row Level Security (RLS)** de la base de datos, asegurando que los usuarios solo pueden acceder a sus propios datos.

**Base de datos utilizada:** Consultar [docs/Backend/Database/kioraV1Database.md](../../Database/kioraV1Database.md)

**Arquitectura:** Consultar [docs/Backend/Api/expressApiArchitecture.md](expressApiArchitecture.md)

---

## 1. Recurso: Profiles (Perfiles)

Este recurso gestiona la información pública y privada del usuario. Gracias a la automatización de la base de datos, cada usuario registrado tiene un perfil garantizado.

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **GET** | `/api/profiles/me` | Obtiene la información del perfil del usuario autenticado de forma segura. |

---

## 2. Recurso: Tags (Etiquetas)

Las etiquetas son el nivel más alto de categorización. Permiten agrupar tareas por temas o contextos.

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **GET** | `/api/tags` | Obtiene todas las etiquetas del usuario autenticado. |
| **POST** | `/api/tags` | Crea una nueva etiqueta. |
| **PUT** | `/api/tags/:id` | Actualiza el nombre de una etiqueta existente. |
| **DELETE** | `/api/tags/:id` | Elimina una etiqueta (las tareas vinculadas pondrán su `tag_id` en `NULL`). |

---

## 3. Recurso: Tasks (Tareas)

Este es el core de la aplicación. Aquí se manejan la prioridad (1-10) y la relación con las etiquetas.

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **GET** | `/api/tasks` | Obtiene todas las tareas del usuario. Soporta query params de filtrado. |
| **GET** | `/api/tasks/:id` | Obtiene el detalle de una tarea específica incluyendo sus subtareas. |
| **POST** | `/api/tasks` | Crea una nueva tarea. |
| **PATCH** | `/api/tasks/:id` | Actualización parcial de una tarea. |
| **DELETE** | `/api/tasks/:id` | Elimina una tarea y sus subtareas por cascada. |

---

## 4. Recurso: Subtasks (Subtareas)

Aunque dependen de una tarea padre, requieren sus propios endpoints para acciones rápidas en la UI.

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **POST** | `/api/tasks/:taskId/subtasks` | Crea una subtarea vinculada a una tarea específica. |
| **PATCH** | `/api/subtasks/:id` | Cambia el estado `is_completed` o edita la descripción. |
| **DELETE** | `/api/subtasks/:id` | Elimina una subtarea específica. |

---

## 5. Endpoint Especial: Dashboard

Para mejorar la experiencia de usuario (UX) en React, se propone un endpoint maestro:

### GET `/api/dashboard`

Retorna un resumen completo de la actividad del usuario en una sola respuesta. Esto evita múltiples llamadas desde el Frontend al cargar la aplicación.

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "summary": {
    "total_tasks": 15,
    "completed_tasks": 7,
    "pending_tasks": 8,
    "total_subtasks": 20,
    "completed_subtasks": 12
  },
  "urgent_tasks": [
    {
      "id": "uuid-task-1",
      "title": "Implementar autenticación",
      "priority": 10,
      "is_completed": false
    },
    {
      "id": "uuid-task-2",
      "title": "Configurar BD",
      "priority": 9,
      "is_completed": false
    }
  ],
  "tags_summary": [
    {
      "id": "uuid-1",
      "name": "Trabajo",
      "task_count": 10
    },
    {
      "id": "uuid-2",
      "name": "Personal",
      "task_count": 5
    }
  ],
  "today_created": [
    {
      "id": "uuid-task-new",
      "title": "Nueva tarea creada hoy",
      "priority": 5
    }
  ]
}
```

**Descripción de campos:**
- `summary`: estadísticas generales de tareas y subtareas.
- `urgent_tasks`: tareas con prioridad 8-10 no completadas.
- `tags_summary`: cantidad de tareas por etiqueta.
- `today_created`: tareas creadas en el día de hoy.

---

## 6. Consideraciones Técnicas

### Autenticación y Autorización

Todos los endpoints requieren:
- **Header `Authorization`** con Bearer Token válido.
- **RLS (Row Level Security)** activado en la BD asegura que solo se devuelven datos del usuario autenticado.

### Códigos HTTP esperados

| Código | Significado |
|--------|-------------|
| **200** | Éxito en GET/PATCH/PUT. |
| **201** | Éxito en POST (recurso creado). |
| **204** | Éxito en DELETE (sin contenido retornado). |
| **400** | Error de validación (body incorrecto). |
| **401** | No autenticado (falta token o token inválido). |
| **403** | No autorizado (intento acceder datos de otro usuario). |
| **404** | Recurso no encontrado. |
| **500** | Error interno del servidor. |

### Paginación (Recomendado futuro)

Para mejorar rendimiento con grandes volúmenes de datos, se sugiere implementar paginación en:
- `GET /api/tasks`
- `GET /api/tags`

Ejemplo:
```
GET /api/tasks?page=1&limit=10
```

### Rate Limiting (Recomendado futuro)

Implementar rate limiting para proteger la API de abuso:
- Máximo 100 requests/minuto por usuario autenticado.

---

## 7. Estructura de Errores

Todos los errores devuelven un objeto JSON estándar:

```json
{
  "error": "Descripción del error",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Ejemplo de error de validación (400):**
```json
{
  "error": "Validación fallida",
  "code": "VALIDATION_ERROR",
  "details": {
    "title": "El título es obligatorio"
  }
}
```