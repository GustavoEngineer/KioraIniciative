/**
 * Representación del modelo Task.
 */
class Task {
    constructor({ id, user_id, tag_id, title, description, is_completed, priority, created_at, tags, subtasks }) {
        this.id = id;
        this.user_id = user_id;
        this.tag_id = tag_id;
        this.title = title;
        this.description = description;
        this.is_completed = is_completed;
        this.priority = priority;
        this.created_at = created_at;

        // Relaciones
        this.tags = tags || null; // Objeto Tag anidado si viene en la query
        this.subtasks = subtasks || []; // Array de subtareas anidadas
    }
}

module.exports = Task;
