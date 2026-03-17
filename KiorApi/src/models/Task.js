/**
 * Representación del modelo Task.
 */
class Task {
    constructor({ id, user_id, tag_id, title, description, status, importance, priority, estimated_time, due_date, created_at, tags, subtasks }) {
        this.id = id;
        this.user_id = user_id;
        this.tag_id = tag_id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.importance = importance;
        this.priority = priority;
        this.estimated_time = estimated_time;
        this.due_date = due_date;
        this.created_at = created_at;

        // Relaciones
        this.tags = tags || null; // Objeto Tag anidado si viene en la query
        this.subtasks = subtasks || []; // Array de subtareas anidadas
    }
}

module.exports = Task;
