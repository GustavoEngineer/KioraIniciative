const getTasks = async (supabase, userId, filters = {}) => {
    const limit = parseInt(filters.limit, 10) || 8;
    const page = parseInt(filters.page, 10) || 1;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('tasks')
        .select(`
            *,
            tags (id, name),
            subtasks (id, description, status)
        `, { count: 'exact' })
        .eq('user_id', userId)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to);

    // Aplicar filtros opcionales (ej: status, priority)
    if (filters.status) {
        query = query.eq('status', filters.status);
    }


    if (filters.priority) {
        query = query.eq('priority', parseInt(filters.priority, 10));
    }

    if (filters.tag_id) {
        query = query.eq('tag_id', filters.tag_id);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { tasks: data, total: count };
};

const getTaskById = async (supabase, taskId) => {
    const { data, error } = await supabase
        .from('tasks')
        .select(`
            *,
            tags (id, name),
            subtasks (id, description, status, created_at)
        `)
        .eq('id', taskId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            throw { statusCode: 404, message: "Tarea no encontrada o no tienes permiso" };
        }
        throw error;
    }
    return data;
};

const createTask = async (supabase, taskData, userId) => {
    const { title, description, priority, tag_id, status, estimated_time, due_date } = taskData;

    const { data, error } = await supabase
        .from('tasks')
        .insert([{
            user_id: userId,
            title,
            description,
            priority: priority || 2,
            tag_id: tag_id || null,
            status: status || 'Por hacer',
            estimated_time: estimated_time || 0,
            due_date: due_date || null
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

const updateTask = async (supabase, taskId, updates) => {
    // updates puede contener: title, description, status, priority, tag_id, due_date
    const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            throw { statusCode: 404, message: "Tarea no encontrada o no tienes permiso" };
        }
        throw error;
    }
    return data;
};

const deleteTask = async (supabase, taskId) => {
    const { error, data } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .select();

    if (error) throw error;
    if (!data || data.length === 0) {
        throw { statusCode: 404, message: "Tarea no encontrada o no tienes permiso" };
    }
    return true;
};

const getTasksByDate = async (supabase, userId, date) => {
    const { data, error } = await supabase
        .from('tasks')
        .select(`
            *,
            tags (id, name),
            subtasks (id, description, status)
        `)
        .eq('user_id', userId)
        .eq('due_date', date) // Filtrar directamente por el campo DATE de Postgres (formato YYYY-MM-DD)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTasksByDate
};
