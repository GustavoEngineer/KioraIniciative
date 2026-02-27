/**
 * Representación del modelo Subtask.
 */
class Subtask {
    constructor({ id, task_id, description, is_completed, created_at }) {
        this.id = id;
        this.task_id = task_id;
        this.description = description;
        this.is_completed = is_completed;
        this.created_at = created_at;
    }
}

module.exports = Subtask;
