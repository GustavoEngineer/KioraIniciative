-- 1. Extensiones y Tipos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('Por hacer', 'En proceso', 'Terminada');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Tabla de Perfiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    username TEXT UNIQUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Etiquetas
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Tareas
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE SET NULL,
    title TEXT NOT NULL CHECK (char_length(title) > 0),
    description TEXT,
    status task_status DEFAULT 'Por hacer',
    priority SMALLINT DEFAULT 2 CHECK (priority IN (2, 5, 8, 10)),
    estimated_time DECIMAL(5,2) DEFAULT 0 CHECK (estimated_time >= 0),
    due_date DATE, -- NUEVO: Fecha de entrega (sin hora)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de Subtareas
CREATE TABLE IF NOT EXISTS subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    description TEXT NOT NULL CHECK (char_length(description) > 0),
    status task_status DEFAULT 'Por hacer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Automatización (Trigger con corrección de error 42710)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- Políticas (Usando DROP/CREATE para evitar errores de duplicado)
DO $$ BEGIN
    DROP POLICY IF EXISTS "Access own profile" ON profiles;
    CREATE POLICY "Access own profile" ON profiles FOR ALL USING (auth.uid() = id);
    
    DROP POLICY IF EXISTS "Access own tags" ON tags;
    CREATE POLICY "Access own tags" ON tags FOR ALL USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Access own tasks" ON tasks;
    CREATE POLICY "Access own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Access own subtasks" ON subtasks;
    CREATE POLICY "Access own subtasks" ON subtasks FOR ALL USING (
        EXISTS (SELECT 1 FROM tasks WHERE tasks.id = subtasks.task_id AND tasks.user_id = auth.uid())
    );
END $$;

-- 8. Índices
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);