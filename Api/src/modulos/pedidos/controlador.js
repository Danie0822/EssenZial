const TABLE_NAME = 'tb_pedidos';
const ID_FIELD = 'id_pedido';
const VISTA = 'vista_pedidos'; 
const ID_VISTA = 'id_correlativo'

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
    async function detallePedido(id) {
        return db.datellesPedidos(VISTA, id, ID_VISTA);
    }

    return {
        todos,
        uno,
        eliminar,
        actualizar,
        detallePedido
    };
    
}