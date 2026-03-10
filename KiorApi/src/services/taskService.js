const getTasks = async (supabase, userId, filters = {}) => {
    let query = supabase
        .from('tasks')
        .select(`
            *,
            tags (id, name),
            subtasks (id, description, is_completed)
        `)
        .order('created_at', { ascending: false });

    // Aplicar filtros opcionales (ej: status, priority)
    if (filters.is_completed !== undefined) {
        query = query.eq('is_completed', filters.is_completed === 'true');
    }

    if (filters.priority) {
        query = query.eq('priority', parseInt(filters.priority, 10));
    }

    if (filters.tag_id) {
        query = query.eq('tag_id', filters.tag_id);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
};

const getTaskById = async (supabase, taskId) => {
    const { data, error } = await supabase
        .from('tasks')
        .select(`
            *,
            tags (id, name),
            subtasks (id, description, is_completed, created_at)
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
    const { title, description, priority, tag_id, due_date, estimated_time } = taskData;

    const { data, error } = await supabase
        .from('tasks')
        .insert([{
            user_id: userId,
            title,
            description,
            priority: priority || 1,
            tag_id: tag_id || null,
            due_date: due_date || null,
            estimated_time: estimated_time || 0
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

const updateTask = async (supabase, taskId, updates) => {
    // updates puede contener: title, description, is_completed, priority, tag_id, due_date
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
    // Aseguramos que buscamos en el rango completo del día
    const startOfDay = `${date}T00:00:00.000Z`;
    const endOfDay = `${date}T23:59:59.999Z`;

    const { data, error } = await supabase
        .from('tasks')
        .select(`
            *,
            tags (id, name),
            subtasks (id, description, is_completed)
        `)
        .eq('user_id', userId)
        .gte('due_date', startOfDay)
        .lte('due_date', endOfDay)
        .order('due_date', { ascending: true });

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
