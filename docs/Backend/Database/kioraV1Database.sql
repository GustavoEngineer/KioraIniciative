-- 1. Extensiones iniciales
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Etiquetas (Tags)
-- Se eliminó el campo color por requerimiento.
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Tareas (Tasks)
-- Prioridad ajustada de 1 a 10 con un CHECK constraint.
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE SET NULL,
    title TEXT NOT NULL CHECK (char_length(title) > 0),
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    priority SMALLINT DEFAULT 1 CHECK (priority >= 1 AND priority <= 10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Subtareas (Subtasks)
-- Estructura independiente con relación directa a la tarea padre.
CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    description TEXT NOT NULL CHECK (char_length(description) > 0),
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Seguridad: Row Level Security (RLS)
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de Acceso (Basadas en el usuario autenticado)
CREATE POLICY "Users can only access their own tags" ON tags
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own tasks" ON tasks
    FOR ALL USING (auth.uid() = user_id);

-- Para subtasks, el acceso se hereda validando que el usuario sea dueño de la tarea padre
CREATE POLICY "Users can access subtasks of their own tasks" ON subtasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tasks 
            WHERE tasks.id = subtasks.task_id 
            AND tasks.user_id = auth.uid()
        )
    );

-- 7. Índices sugeridos para optimizar rendimiento de filtrado
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);