-- 1. Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Perfiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    username TEXT UNIQUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Etiquetas
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Tareas
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE SET NULL,
    title TEXT NOT NULL CHECK (char_length(title) > 0),
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    priority SMALLINT DEFAULT 1 CHECK (priority >= 1 AND priority <= 10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de Subtareas
CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    description TEXT NOT NULL CHECK (char_length(description) > 0),
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Automatización (Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Profile access" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Tags access" ON tags FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Tasks access" ON tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Subtasks access" ON subtasks FOR ALL USING (
    EXISTS (SELECT 1 FROM tasks WHERE tasks.id = subtasks.task_id AND tasks.user_id = auth.uid())
);

-- 8. Índices
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX idx_tags_user_id ON tags(user_id);