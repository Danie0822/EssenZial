const fs = require('fs').promises;
// Nombres de campos de la tabla 
const TABLE_NAME = 'vw_ultimos_productos';
// Funciones y llamada de db 
module.exports = function (db) {

    async function todos() {
        const pedidos = await db.todos(TABLE_NAME);
        return pedidos.map(pedidos => ({
            ...pedidos  
        }));
    }

    return {
        todos
    };
};
