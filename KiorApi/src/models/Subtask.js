/**
 * Representación del modelo Subtask.
 */
class Subtask {
    constructor({ id, task_id, description, status, created_at }) {
        this.id = id;
        this.task_id = task_id;
        this.description = description;
        this.status = status;
        this.created_at = created_at;
    }
}

module.exports = Subtask;
