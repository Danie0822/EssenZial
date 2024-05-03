const TABLE_NAME = 'tb_pedidos';
const ID_FIELD = 'id_pedido';

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
    async function actualizar(data) {
        const { id_pedido, ...restoDatos } = data;
        return db.actualizar(TABLE_NAME, restoDatos, ID_FIELD,id_pedido);
    }

    return {
        todos,
        uno,
        eliminar,
        actualizar
    };
    
}