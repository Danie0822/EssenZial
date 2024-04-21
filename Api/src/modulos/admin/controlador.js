const TABLE_NAME = 'tb_admins';
const ID_FIELD = 'id_admin';

module.exports = function (db) {
    async function todos() {
        return db.todos(TABLE_NAME);
    }

    async function uno(id) {
        return db.uno(TABLE_NAME, id, ID_FIELD);
    }

    async function eliminar(id) {
        return db.eliminar(TABLE_NAME, id, ID_FIELD);
    }

    async function agregar(data) {
        return db.agregar(TABLE_NAME, data);
    }

    async function actualizar(data) {
        const { id_admin, ...restoDatos } = data;
        return db.actualizar(TABLE_NAME, restoDatos, ID_FIELD, id_admin);
    }

    return {
        todos,
        uno,
        eliminar,
        agregar,
        actualizar
    };
};
