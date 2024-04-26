const TABLE_NAME = 'tb_pedidos';
const ID_FIELD = 'id_pedido';

module.exports = function (db) {
    async function todos() {
        return db.todos(TABLE_NAME);
    }
    async function uno(id) {
        return db.uno(TABLE_NAME, id, ID_FIELD);
    }

    return {
        todos,
        uno
    };
    
}