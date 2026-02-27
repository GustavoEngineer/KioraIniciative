const Profile = require('../models/Profile');

const getProfile = async (supabase, userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            throw { statusCode: 404, message: "Perfil no encontrado" };
        }
        throw error;
    }

    return new Profile(data);
};

module.exports = {
    getProfile
};
