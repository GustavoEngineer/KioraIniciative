const createSubtask = async (supabase, taskId, description) => {
    const { data, error } = await supabase
        .from('subtasks')
        .insert([{
            task_id: taskId,
            description
        }])
        .select()
        .single();

    if (error) {
        // RLS will fail silently or throw PGRST116 if user doesn't own parent task
        throw error;
    }
    return data;
};

const updateSubtask = async (supabase, subtaskId, updates) => {
    // updates puede contener: description, is_completed
    const { data, error } = await supabase
        .from('subtasks')
        .update(updates)
        .eq('id', subtaskId)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            throw { statusCode: 404, message: "Subtarea no encontrada o no tienes permiso sobre la tarea padre" };
        }
        throw error;
    }
    return data;
};

const deleteSubtask = async (supabase, subtaskId) => {
    const { error, data } = await supabase
        .from('subtasks')
        .delete()
        .eq('id', subtaskId)
        .select();

    if (error) throw error;
    if (!data || data.length === 0) {
        throw { statusCode: 404, message: "Subtarea no encontrada o no tienes permiso sobre la tarea padre" };
    }
    return true;
};

module.exports = {
    createSubtask,
    updateSubtask,
    deleteSubtask
};
