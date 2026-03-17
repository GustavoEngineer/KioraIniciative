const subtaskService = require('../services/subtaskService');
const { getSupabaseClient } = require('../config/supabaseClient');

const getSubtasksByTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const supabase = getSupabaseClient(req);
        const subtasks = await subtaskService.getSubtasksByTask(supabase, taskId);
        res.status(200).json(subtasks);
    } catch (error) {
        next(error);
    }
};

const createSubtask = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const { description } = req.body;

        if (!description || description.trim().length === 0) {
            return res.status(400).json({ error: "Validación fallida", code: "VALIDATION_ERROR", details: { message: "La descripción de la subtarea es obligatoria" } });
        }

        const supabase = getSupabaseClient(req);
        const newSubtask = await subtaskService.createSubtask(supabase, taskId, description.trim());
        res.status(201).json(newSubtask);
    } catch (error) {
        if (error.code === '23503' || error.code === 'PGRST116') {
            return res.status(404).json({ error: "No encontrado", code: "NOT_FOUND", details: { message: "La tarea padre no existe o no tienes permiso" } });
        }
        next(error);
    }
};

const updateSubtask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { description, status } = req.body;

        const updates = {};
        if (description !== undefined) updates.description = description.trim();
        if (status !== undefined) updates.status = status;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "Validación fallida", code: "VALIDATION_ERROR", details: { message: "No se enviaron campos válidos para actualizar" } });
        }

        const supabase = getSupabaseClient(req);
        const updatedSubtask = await subtaskService.updateSubtask(supabase, id, updates);
        res.status(200).json(updatedSubtask);
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ error: "No encontrado", code: "NOT_FOUND", details: { message: error.message } });
        }
        next(error);
    }
};

const deleteSubtask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const supabase = getSupabaseClient(req);

        await subtaskService.deleteSubtask(supabase, id);
        res.status(204).send();
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ error: "No encontrado", code: "NOT_FOUND", details: { message: error.message } });
        }
        next(error);
    }
};

module.exports = {
    getSubtasksByTask,
    createSubtask,
    updateSubtask,
    deleteSubtask
};
