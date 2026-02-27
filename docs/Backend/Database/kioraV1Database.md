# Documentación: Esquema Kiora V1

Esta documentación describe las tablas, atributos y configuraciones definidas en el archivo SQL de referencia: [docs/Backend/Database/kioraV1Database.sql](docs/Backend/Database/kioraV1Database.sql).

**Resumen:**
- **Extensión:** `uuid-ossp` para generación de UUIDs.
- Tablas principales: `profiles`, `tags`, `tasks`, `subtasks`.
- Seguridad: Row Level Security (RLS) habilitada y privacidad total por usuario.
- Automatización: Trigger para crear automáticamente el registro en `profiles`.
- Índices sugeridos para optimización de consultas.

---

**Extensiones y configuración global**:

- **Extensión `uuid-ossp`:** habilitada con `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`. Se usa `uuid_generate_v4()` como valor por defecto para `id` en las tablas.

---

**Tabla `profiles`**

Descripción: almacena el perfil del usuario, sincronizado automáticamente desde `auth.users`. Resuelve la integridad referencial de forma limpia para PostgreSQL.

Columnas:

- **`id`**: UUID, `PRIMARY KEY`, `REFERENCES auth.users(id) ON DELETE CASCADE` — identificador del usuario (mismo que en auth).
- **`full_name`**: `TEXT` — nombre completo del usuario.
- **`username`**: `TEXT UNIQUE` — nombre de usuario elegible (único).
- **`updated_at`**: `TIMESTAMPTZ DEFAULT NOW()` — marca de tiempo de última actualización.

Restricciones y notas:

- En el frontend permite hacer un `SELECT * FROM profiles WHERE id = auth.uid()` para mostrar el nombre y la foto del usuario en el Dashboard sin complicaciones de auth metadata.

---

**Tabla `tags`**

Descripción: almacena etiquetas creadas por usuarios para categorizar tareas.

Columnas:

- **`id`**: UUID, `PRIMARY KEY`, `DEFAULT uuid_generate_v4()` — identificador único de la etiqueta.
- **`user_id`**: UUID, `NOT NULL`, `REFERENCES profiles(id) ON DELETE CASCADE` — referencia al perfil del propietario de la etiqueta; en cascada al borrar el perfil.
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
- **`user_id`**: UUID, `NOT NULL`, `REFERENCES profiles(id) ON DELETE CASCADE` — referencia al perfil propietario de la tarea.
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

**Automatización (Trigger)**

Se cuenta con un Trigger `on_auth_user_created` que ejecuta la función `handle_new_user()` al insertar un nuevo usuario en `auth.users`.
- **Mecanismo**: al registrar un usuario, la BD inserta automáticamente su información en la tabla `profiles`.
- **Beneficio**: garantiza que nunca se tendrá una tarea o etiqueta sin un perfil asociado. Cuando el usuario se registra en la app (ej. React), la DB se prepara sola.

> [!NOTE]  
> **Creando Usuarios de Prueba (Desarrollo):**
> Si vas a crear usuarios de prueba directamente desde el **Dashboard de Supabase** para usar la API, por defecto Supabase pedirá que verifiquen su correo. Para que puedan hacer consultas API sin problemas:
> 1. Desactiva la opción **"Confirm email"** en Supabase: `Authentication -> Providers -> Email`.
> 2. Opcionalmente, puedes confirmar el usuario recién creado ejecutando este comando de SQL en el **SQL Editor** del dashboard de Supabase (reemplaza por el correo que creaste):
>    ```sql
>    UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'test@example.com';
>    ```

---

**Seguridad: Row Level Security (RLS) y Políticas**

- Se habilita RLS en cuatro tablas: `profiles`, `tags`, `tasks`, `subtasks`.
- Políticas definidas:
  - `"Profile access"` ON `profiles` FOR ALL USING `(auth.uid() = id)` — un usuario solo puede acceder a su propio perfil (no hay permisos de lectura pública).
  - `"Tags access"` ON `tags` FOR ALL USING `(auth.uid() = user_id)` — limita acceso a etiquetas por propietario.
  - `"Tasks access"` ON `tasks` FOR ALL USING `(auth.uid() = user_id)` — limita acceso a tareas por propietario.
  - `"Subtasks access"` ON `subtasks` FOR ALL USING (existe verificación que el `task_id` pertenece a una task con `user_id = auth.uid()`) — acceso a subtareas validando propiedad de la tarea padre.

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
