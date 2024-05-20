const fs = require('fs').promises;

const TABLE_NAME = 'tb_inventarios';
const ID_FIELD = 'id_inventario';
const VISTA_PRODUCTOS = 'vw_productos';



module.exports = function (db) {
    async function todos() {
        return db.todos(TABLE_NAME);
    }
    async function uno(id) {
        return db.detalleInventario(id, ID_FIELD);
    }
    async function agregar(body) {
        return db.agregar(TABLE_NAME, body);
    }
    async function actualizar(body) {
        const { id_inventario, ...datos } = body;
        return db.actualizar(TABLE_NAME, datos, ID_FIELD, id_inventario);
    }
    async function eliminar(id_inventario) {
        return db.eliminar(TABLE_NAME, id_inventario, ID_FIELD);
    }
    async function todosProductos(){
        return db.todos(VISTA_PRODUCTOS);
    }

    return {
        todos,
        uno,
        agregar,
        actualizar,
        eliminar,
        todosProductos
    };
};



