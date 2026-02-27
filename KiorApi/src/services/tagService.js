const getTags = async (supabase) => {
    const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

const createTag = async (supabase, name, userId) => {
    const { data, error } = await supabase
        .from('tags')
        .insert([{ name, user_id: userId }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

const updateTag = async (supabase, id, name) => {
    // Si la etiqueta no es del usuario (RLS), Supabase retornará una fila en 0 o error dependiendo si existe.
    // .select().single() lanzará un error (PGRST116) si encuentra 0 rows con Single.
    const { data, error } = await supabase
        .from('tags')
        .update({ name })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            throw { statusCode: 404, message: "Tag no encontrado o no tienes permiso" };
        }
        throw error;
    }
    return data;
};

const deleteTag = async (supabase, id) => {
    const { error, data } = await supabase
        .from('tags')
        .delete()
        .eq('id', id)
        .select();

    if (error) throw error;
    if (!data || data.length === 0) {
        throw { statusCode: 404, message: "Tag no encontrado o no tienes permiso" };
    }
    return true;
};

module.exports = {
    getTags,
    createTag,
    updateTag,
    deleteTag
};
