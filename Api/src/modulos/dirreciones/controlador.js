// Nombre de campos de la tabla 
const TABLE_NAME = 'tb_direcciones';
const ID_FIELD = 'id_direccion';
const CLIENTE = 'id_cliente';
// funciones y llamadas de db
module.exports = function (db) {
    async function todos() {
        return db.todos(TABLE_NAME);
    }

    async function uno(id) {
        return db.uno(TABLE_NAME, id, CLIENTE);
    }

    async function eliminar(id) {
        return db.eliminar(TABLE_NAME, id, ID_FIELD);
    }

    async function agregar(data) {
        return db.agregar(TABLE_NAME, data);
    }

    async function actualizar(data) {
        const { id_direccion, ...restoDatos } = data;
        return db.actualizar(TABLE_NAME, restoDatos, ID_FIELD, id_direccion);
    }

    return {
        todos,
        uno,
        eliminar,
        agregar,
        actualizar
    };
};
