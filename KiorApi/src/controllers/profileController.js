const profileService = require('../services/profileService');
const { getSupabaseClient } = require('../config/supabaseClient');

const getMyProfile = async (req, res, next) => {
    try {
        const supabase = getSupabaseClient(req);
        // req.user.id viene garantizado por authMiddleware
        const profile = await profileService.getProfile(supabase, req.user.id);
        res.status(200).json(profile);
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ error: "No encontrado", code: "NOT_FOUND", details: { message: error.message } });
        }
        next(error);
    }
};

module.exports = {
    getMyProfile
};
