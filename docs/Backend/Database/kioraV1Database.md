# Documentación: Esquema Kiora V1

Esta documentación describe las tablas, atributos y configuraciones definidas en el archivo SQL de referencia: [docs/Backend/Database/kioraV1Database.sql](docs/Backend/Database/kioraV1Database.sql).

**Resumen:**
- **Extensión:** `uuid-ossp` para generación de UUIDs.
- Tablas principales: `tags`, `tasks`, `subtasks`.
- Seguridad: Row Level Security (RLS) habilitada y políticas por usuario.
- Índices sugeridos para optimización de consultas.

---

**Extensiones y configuración global**:

- **Extensión `uuid-ossp`:** habilitada con `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`. Se usa `uuid_generate_v4()` como valor por defecto para `id` en las tablas.

---

**Tabla `tags`**

Descripción: almacena etiquetas creadas por usuarios para categorizar tareas.

Columnas:

- **`id`**: UUID, `PRIMARY KEY`, `DEFAULT uuid_generate_v4()` — identificador único de la etiqueta.
- **`user_id`**: UUID, `NOT NULL`, `REFERENCES auth.users(id) ON DELETE CASCADE` — referencia al propietario (usuario) de la etiqueta; en cascada al borrar el usuario.
- **`name`**: `VARCHAR(50) NOT NULL` — nombre de la etiqueta (máx. 50 caracteres).
- **`created_at`**: `TIMESTAMPTZ DEFAULT NOW()` — marca de tiempo de creación.

Restricciones y notas:

- No existe campo `color` (se eliminó por requerimiento).
- RLS habilitado para proteger acceso por usuario (ver sección RLS/políticas).

---

**Tabla `tasks`**

Descripción: lista de tareas del usuario; puede estar relacionada opcionalmente con una `tag`.

Columnas:

- **`id`**: UUID, `PRIMARY KEY`, `DEFAULT uuid_generate_v4()` — identificador único de la tarea.
- **`user_id`**: UUID, `NOT NULL`, `REFERENCES auth.users(id) ON DELETE CASCADE` — propietario de la tarea.
- **`tag_id`**: UUID, `REFERENCES tags(id) ON DELETE SET NULL` — etiqueta asociada (opcional). Si la etiqueta se borra, se pone `NULL`.
- **`title`**: `TEXT NOT NULL CHECK (char_length(title) > 0)` — título de la tarea; check garantiza no string vacío.
- **`description`**: `TEXT` — descripción libre de la tarea.
- **`is_completed`**: `BOOLEAN DEFAULT FALSE` — estado de completado.
- **`priority`**: `SMALLINT DEFAULT 1 CHECK (priority >= 1 AND priority <= 10)` — prioridad en rango 1..10; valor por defecto `1`.
- **`created_at`**: `TIMESTAMPTZ DEFAULT NOW()` — fecha de creación.

Restricciones y notas:

- `priority` utiliza `SMALLINT` y un `CHECK` para forzar valores entre 1 y 10 (ajuste solicitado).
- `title` tiene `CHECK` para evitar títulos vacíos.
- `tag_id` no es obligatorio; la relación usa `ON DELETE SET NULL` para mantener la tarea si la etiqueta se elimina.

---

**Tabla `subtasks`**

Descripción: subtareas dependientes de una `task` principal.

Columnas:

- **`id`**: UUID, `PRIMARY KEY`, `DEFAULT uuid_generate_v4()` — identificador único de la subtarea.
- **`task_id`**: UUID, `NOT NULL`, `REFERENCES tasks(id) ON DELETE CASCADE` — referencia a la tarea padre; si la tarea se borra, las subtareas se eliminan.
- **`description`**: `TEXT NOT NULL CHECK (char_length(description) > 0)` — descripción obligatoria de la subtarea.
- **`is_completed`**: `BOOLEAN DEFAULT FALSE` — estado de completado.
- **`created_at`**: `TIMESTAMPTZ DEFAULT NOW()` — fecha de creación.

Restricciones y notas:

- Las subtareas están atadas a una `task` mediante `task_id` y heredan eliminación mediante `ON DELETE CASCADE`.

---

**Seguridad: Row Level Security (RLS) y Políticas**

- Se habilita RLS en las tres tablas: `tags`, `tasks`, `subtasks`.
- Políticas definidas:
  - `Users can only access their own tags` ON `tags` FOR ALL USING `(auth.uid() = user_id)` — limita acceso a etiquetas por propietario.
  - `Users can only access their own tasks` ON `tasks` FOR ALL USING `(auth.uid() = user_id)` — limita acceso a tareas por propietario.
  - `Users can access subtasks of their own tasks` ON `subtasks` FOR ALL USING (existe verificación que el `task_id` pertenece a una task con `user_id = auth.uid()`) — acceso a subtareas validando propiedad de la tarea padre.

Notas de implementación:

- Las políticas usan `auth.uid()` (asume integración con esquema `auth` o mecanismo de autenticación compatible con la función `auth.uid()`).
- Asegurar que la función `auth.uid()` devuelva el UUID del usuario autenticado en el contexto de la sesión/cliente.

---

**Índices sugeridos**

- `CREATE INDEX idx_tasks_user_id ON tasks(user_id);` — acelera consultas filtradas por `user_id` sobre `tasks`.
- `CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);` — acelera búsquedas de subtareas por `task_id`.

Recomendación: evaluar consultas reales con `EXPLAIN` y crear índices adicionales (por ejemplo: `tasks(tag_id)`, índices compuestos) según patrones de lectura/escritura.

---

**Ejemplo de flujo (registro de una tarea con tag y subtareas)**

1. Usuario crea una `tag` en `tags` con su `user_id`.
2. Usuario crea una `task` referenciando `tag_id` y su propio `user_id`.
3. Usuario añade `subtasks` vinculadas a `task_id`.
4. RLS y políticas aseguran que solo ese `user_id` pueda leer/editar/borra los registros.
