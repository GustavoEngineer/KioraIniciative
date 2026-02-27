/**
 * Representación del modelo Profile.
 * Dado que usamos Supabase (y no un ORM como Prisma o Mongoose),
 * estos modelos sirven como documentación estructurada (DTOs) 
 * y pueden expandirse para validaciones de esquema más adelante.
 */
class Profile {
    constructor({ id, full_name, username, updated_at }) {
        this.id = id;
        this.full_name = full_name;
        this.username = username;
        this.updated_at = updated_at;
    }
}

module.exports = Profile;
