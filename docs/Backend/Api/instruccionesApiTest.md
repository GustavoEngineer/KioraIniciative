# Guía de Pruebas: Kiora V1 API

Esta guía detalla el flujo paso a paso para probar los endpoints de la API de Kiora V1 simulando el comportamiento de un usuario real. 

Puedes usar herramientas como **Postman**, **Insomnia**, o **Thunder Client** (extensión integrada en VS Code).

## Requisitos Previos

1. Tener el servidor corriendo (ejecuta `npm run dev` dentro de la carpeta `KiorApi`).
2. Verificar que tienes tu archivo `.env` configurado con `SUPABASE_URL` y `SUPABASE_ANON_KEY`.
3. Tener un usuario registrado en tu proyecto de Supabase.
4. Obtener el **Access Token (JWT)** de ese usuario.
    - *Tip:* Para obtener tu token fácilmente en desarrollo, puedes usar el script de ayuda incluido en el backend:
      ```bash
      # Dentro de la carpeta KiorApi, ejecuta:
      node scripts/auth-helper.js
      ```
      Este script se conectará a Supabase con las credenciales de prueba configuradas en él y te devolverá el token JWT listo para usar en tus peticiones. Solo asegúrate de tener el usuario de prueba creado y confirmado en tu base de datos si usas credenciales locales, y configura tu `.env`.

---

## Configuración Global de la Herramienta (Headers)

Para todos los endpoints descritos abajo, debes asegurarte de que tu cliente HTTP envíe los siguientes **Headers**:

- **Authorization:** `Bearer <TU_ACCESS_TOKEN_JWT>`
- **Content-Type:** `application/json`

**URL Base de la API:** `http://localhost:3000/api`

### 💡 Configuración Recomendada en Postman

Para no tener que pegar el token en cada petición ni escribir toda la URL base cada vez, sigue estos pasos:

1. **Crear una Colección:**
   En Postman, haz clic en "New" > "Collection" y nómbrala "Kiora V1 API".
   Todas las pruebas que hagas debes guardarlas dentro de esta colección.

2. **Configurar el Token a Nivel de Colección (¡Muy Importante!):**
   - Selecciona tu nueva colección haciendo clic sobre ella en la barra lateral izquierda.
   - Ve a la pestaña **"Authorization"** en el panel principal.
   - En el menú desplegable "Type", selecciona **"Bearer Token"**.
   - En el campo "Token", pega el JWT enorme (`eyJhbGci...`) que te generó el script `auth-helper.js`.
   - **Guarda los cambios** (Ctrl+S / Cmd+S).
   - *Nota:* A partir de ahora, todas las peticiones que guardes dentro de esta colección heredarán automáticamente este token. No necesitas agregarlo manualmente.

3. **Configurar Variables (Opcional pero Recomendado):**
   - Ve a la pestaña **"Variables"** de la colección.
   - Crea una variable llamada `base_url` con el valor inicial y actual `http://localhost:3000/api`.
   - Al guardar las peticiones futuras, en lugar de escribir toda la URL puedes simplemente usar `{{base_url}}/profiles/me` y Postman reemplazará la variable automáticamente.

---

## Flujo de Usuario de Prueba (Paso a Paso)

### 1. Validar Autenticación (Mi Perfil)
Comprueba que el token es válido, que RLS funciona y obtén los datos de tu usuario.

- **Método:** `GET`
- **Endpoint:** `/profiles/me`
- **Respuesta esperada (200 OK):**
  ```json
  {
    "id": "tu-uuid",
    "full_name": "Tu Nombre",
    "username": "tu_usuario",
    "updated_at": "2024-..."
  }
  ```

### 2. Crear Etiquetas (Tags)
Crea un par de etiquetas para categorizar tus tareas.

- **Método:** `POST`
- **Endpoint:** `/tags`
- **Body (JSON):**
  ```json
  {
    "name": "Trabajo"
  }
  ```
- **Acción sugerida:** Copia el `id` de la etiqueta que te devuelve la respuesta. Repite el proceso para crear otra etiqueta llamada "Personal".

### 3. Crear una Tarea (Task)
Ahora crearemos una tarea urgente y le asignaremos la etiqueta "Trabajo".

- **Método:** `POST`
- **Endpoint:** `/tasks`
- **Body (JSON):**
  ```json
  {
    "title": "Construir KiorApi",
    "description": "Desarrollar y probar todos los endpoints del backend.",
    "priority": 10,
    "tag_id": "<PEGA_AQUÍ_EL_ID_DE_TU_ETIQUETA_TRABAJO>"
  }
  ```
- **Acción sugerida:** Copia el `id` de la tarea generada.

### 4. Añadir Subtareas (Subtasks)
Desglose de la tarea principal en pequeños pasos.

- **Método:** `POST`
- **Endpoint:** `/tasks/<PEGA_AQUÍ_ID_DE_LA_TAREA>/subtasks`
- **Body (JSON):**
  ```json
  {
    "description": "Probar endpoint de perfiles"
  }
  ```
- **Acción sugerida:** Crea 2 o 3 subtareas más. Copia el `id` de la primera subtarea creada.

### 5. Ver el Listado Completo de Tareas
Comprueba que la base de datos te trae la tarea con toda la información anidada (la etiqueta resuelta y un arreglo con sus subtareas).

- **Método:** `GET`
- **Endpoint:** `/tasks`
- *(Opcional)* También puedes probar enviar query params para filtrar: `/tasks?is_completed=false&priority=10`

### 6. Actualizar una Subtarea
Supongamos que ya terminaste uno de los pasos. Vamos a marcar la subtarea como completada.

- **Método:** `PATCH`
- **Endpoint:** `/subtasks/<PEGA_AQUÍ_ID_DE_LA_SUBTAREA>`
- **Body (JSON):**
  ```json
  {
    "is_completed": true
  }
  ```

### 7. Consultar el Dashboard General
Este es el Endpoint maestro para la pantalla de inicio de tu Frontend.

- **Método:** `GET`
- **Endpoint:** `/dashboard`
- **Validación:** Analiza la respuesta. Deberías ver un `summary` que indica 1 tarea pendiente, unas cuantas subtareas (con la que acabas de marcar como completada) y esa tarea debe aparecer en la lista de `urgent_tasks` porque tiene prioridad 10.

### 8. Actualizar la Tarea Principal
Haz de cuenta que terminaste el desarrollo. Marca la tarea padre como completada.

- **Método:** `PATCH`
- **Endpoint:** `/tasks/<PEGA_AQUÍ_ID_DE_LA_TAREA>`
- **Body (JSON):**
  ```json
  {
    "is_completed": true,
    "priority": 5
  }
  ```

### 9. Revisar nuevamente el Dashboard
- **Método:** `GET`
- **Endpoint:** `/dashboard`
- **Validación:** Comprueba cómo los valores del `summary` cambiaron dinámicamente. La tarea ya no debería aparecer en `urgent_tasks` porque ahora está completada y su prioridad bajó.

### 10. Pruebas de Limpieza y Cascada (Opcional)
Comprueba la integridad referencial de la base de datos SQL que diseñamos.

**A. Eliminar Etiqueta**
- **Método:** `DELETE`
- **Endpoint:** `/tags/<ID_DE_LA_ETIQUETA_TRABAJO>`
- *Efecto esperado:* Te regresará 204 No Content. La tarea seguirá existiendo, pero si haces un `GET /tasks`, verás que el campo `tag_id` de la tarea ahora es `null`.

**B. Eliminar Tarea**
- **Método:** `DELETE`
- **Endpoint:** `/tasks/<ID_DE_LA_TAREA>`
- *Efecto esperado:* La tarea desaparecerá. Pero aún mejor: **todas sus subtareas** habrán sido eliminadas automáticamente de la base de datos sin dejar registros "huérfanos".
