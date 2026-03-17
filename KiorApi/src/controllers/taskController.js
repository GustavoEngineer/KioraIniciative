const taskService = require('../services/taskService');
const { getSupabaseClient } = require('../config/supabaseClient');

const getTasks = async (req, res, next) => {
    try {
        const supabase = getSupabaseClient(req);
        // req.query puede traer ?status=En proceso&importance=Anotado&page=1&limit=8
        const result = await taskService.getTasks(supabase, req.user.id, req.query);
        res.status(200).json(result);
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
        const { title, description, priority, tag_id, importance, estimated_time, due_date } = req.body;

        if (!title || title.trim().length === 0) {
            return res.status(400).json({ error: "Validación fallida", code: "VALIDATION_ERROR", details: { message: "El título de la tarea es obligatorio" } });
        }

        if (priority && ![2, 5, 8, 10].includes(parseInt(priority, 10))) {
            return res.status(400).json({ error: "Validación fallida", code: "VALIDATION_ERROR", details: { message: "La prioridad debe ser 2, 5, 8 o 10" } });
        }

        const supabase = getSupabaseClient(req);
        const newTask = await taskService.createTask(supabase, { title: title.trim(), description, priority, tag_id, importance, estimated_time, due_date }, req.user.id);
        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, status, importance, priority, tag_id, estimated_time, due_date } = req.body;

        // Evitamos enviar propiedades undefined al update de Supabase
        const updates = {};
        if (title !== undefined) updates.title = title.trim();
        if (description !== undefined) updates.description = description;
        if (status !== undefined) updates.status = status;
        if (importance !== undefined) updates.importance = importance;
        if (tag_id !== undefined) updates.tag_id = tag_id === "" ? null : tag_id;
        if (estimated_time !== undefined) updates.estimated_time = estimated_time;
        if (due_date !== undefined) updates.due_date = due_date === "" ? null : due_date;

        if (priority !== undefined) {
            if (![2, 5, 8, 10].includes(parseInt(priority, 10))) {
                return res.status(400).json({ error: "Validación fallida", code: "VALIDATION_ERROR", details: { message: "La prioridad debe ser 2, 5, 8 o 10" } });
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

const getTasksByDate = async (req, res, next) => {
    try {
        const { date } = req.query; // Esperamos YYYY-MM-DD

        if (!date) {
            return res.status(400).json({ error: "Faltan parámetros", code: "MISSING_PARAMS", details: { message: "El parámetro 'date' es obligatorio (formato YYYY-MM-DD)" } });
        }

        const supabase = getSupabaseClient(req);
        const tasks = await taskService.getTasksByDate(supabase, req.user.id, date);
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTasksByDate
};
