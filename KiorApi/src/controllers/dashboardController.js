const dashboardService = require('../services/dashboardService');
const { getSupabaseClient } = require('../config/supabaseClient');

const getDashboardSummary = async (req, res, next) => {
    try {
        const supabase = getSupabaseClient(req);
        // req.user.id viene garantizado por authMiddleware
        const summary = await dashboardService.getDashboardSummary(supabase, req.user.id);
        res.status(200).json(summary);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardSummary
};
