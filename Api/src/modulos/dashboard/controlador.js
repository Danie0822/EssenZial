const fs = require('fs').promises;
// Nombres de campos de la tabla 
const TABLE_NAME = 'ultimos_pedidos';
const TABLE_NAMEI = 'vw_descuentos_proximos_finalizar';
// Funciones y llamada de db 
module.exports = function (db) {

    async function todos() {
        const pedidos = await db.todos(TABLE_NAME);
        return pedidos.map(pedidos => ({
            ...pedidos,
            imagen_pedidos: pedidos.imagen_pedidos || null
        }));
    }
    async function ofertas() {
            return db.todos(TABLE_NAMEI);
    }
    

    return {
        todos,
        ofertas
    };
};
