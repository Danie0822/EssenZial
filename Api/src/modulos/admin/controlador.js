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
        const { nombre_admin, apellido_admin, correo_admin, clave_admin, id_admin } = data;
        const newData = {
            nombre_admin,
            apellido_admin,
            correo_admin,
            clave_admin
        };
        return db.actualizar(TABLE_NAME, newData, ID_FIELD, id_admin);
    }

    return {
        todos,
        uno,
        eliminar,
        agregar,
        actualizar
    };
};
