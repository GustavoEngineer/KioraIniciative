/**
 * Representación del modelo Tag.
 */
class Tag {
    constructor({ id, user_id, name, created_at }) {
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.created_at = created_at;
    }
}

module.exports = Tag;
