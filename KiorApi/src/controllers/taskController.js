const taskService = require('../services/taskService');
const { getSupabaseClient } = require('../config/supabaseClient');

const getTasks = async (req, res, next) => {
    try {
        const supabase = getSupabaseClient(req);
        // req.query puede traer ?is_completed=true&priority=5
        const tasks = await taskService.getTasks(supabase, req.user.id, req.query);
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

const getTaskById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const supabase = getSupabaseClient(req);
        const task = await taskService.getTaskById(supabase, id);
        res.status(200).json(task);
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ error: "No encontrado", code: "NOT_FOUND", details: { message: error.message } });
        }
        next(error);
    }
};

const createTask = async (req, res, next) => {
    try {
        const { title, description, priority, tag_id } = req.body;

        if (!title || title.trim().length === 0) {
            return res.status(400).json({ error: "Validación fallida", code: "VALIDATION_ERROR", details: { message: "El título de la tarea es obligatorio" } });
        }

        if (priority && (priority < 1 || priority > 10)) {
            return res.status(400).json({ error: "Validación fallida", code: "VALIDATION_ERROR", details: { message: "La prioridad debe estar entre 1 y 10" } });
        }

        const supabase = getSupabaseClient(req);
        const newTask = await taskService.createTask(supabase, { title: title.trim(), description, priority, tag_id }, req.user.id);
        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, is_completed, priority, tag_id } = req.body;

        // Evitamos enviar propiedades undefined al update de Supabase
        const updates = {};
        if (title !== undefined) updates.title = title.trim();
        if (description !== undefined) updates.description = description;
        if (is_completed !== undefined) updates.is_completed = is_completed;
        if (tag_id !== undefined) updates.tag_id = tag_id === "" ? null : tag_id; // Permitir anular el tag enviando string vacio o null

        if (priority !== undefined) {
            if (priority < 1 || priority > 10) {
                return res.status(400).json({ error: "Validación fallida", code: "VALIDATION_ERROR", details: { message: "La prioridad debe estar entre 1 y 10" } });
            }
            updates.priority = priority;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "Validación fallida", code: "VALIDATION_ERROR", details: { message: "No se enviaron campos válidos para actualizar" } });
        }

        const supabase = getSupabaseClient(req);
        const updatedTask = await taskService.updateTask(supabase, id, updates);
        res.status(200).json(updatedTask);
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ error: "No encontrado", code: "NOT_FOUND", details: { message: error.message } });
        }
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const supabase = getSupabaseClient(req);

        await taskService.deleteTask(supabase, id);
        res.status(204).send();
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ error: "No encontrado", code: "NOT_FOUND", details: { message: error.message } });
        }
        next(error);
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};
