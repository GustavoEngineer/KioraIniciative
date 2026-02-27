const tagService = require('../services/tagService');
const { getSupabaseClient } = require('../config/supabaseClient');

const getTags = async (req, res, next) => {
    try {
        const supabase = getSupabaseClient(req);
        const tags = await tagService.getTags(supabase);
        res.status(200).json(tags);
    } catch (error) {
        next(error);
    }
};

const createTag = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ error: "Validación fallida", code: "VALIDATION_ERROR", details: { message: "El nombre de la etiqueta es obligatorio" } });
        }

        const supabase = getSupabaseClient(req);
        const newTag = await tagService.createTag(supabase, name.trim(), req.user.id);
        res.status(201).json(newTag);
    } catch (error) {
        next(error);
    }
};

const updateTag = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ error: "Validación fallida", code: "VALIDATION_ERROR", details: { message: "El nombre de la etiqueta es obligatorio" } });
        }

        const supabase = getSupabaseClient(req);
        const updatedTag = await tagService.updateTag(supabase, id, name.trim());
        res.status(200).json(updatedTag);
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ error: "No encontrado", code: "NOT_FOUND", details: { message: error.message } });
        }
        next(error);
    }
};

const deleteTag = async (req, res, next) => {
    try {
        const { id } = req.params;
        const supabase = getSupabaseClient(req);

        await tagService.deleteTag(supabase, id);
        res.status(204).send();
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ error: "No encontrado", code: "NOT_FOUND", details: { message: error.message } });
        }
        next(error);
    }
};

module.exports = {
    getTags,
    createTag,
    updateTag,
    deleteTag
};
