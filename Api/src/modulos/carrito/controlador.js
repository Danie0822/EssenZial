const fs = require('fs').promises;
// Nombres de campos de la tabla 
const TABLE_NAME = 'vw_carrito';
const TABLE = 'tb_pedidos';
const DIRECCIONES = 'vw_direcciones_cliente';
const PROCEDIUR = 'eliminar_detalle_pedido' ;
const ID_DETALLE = 'id_detalle_pedido';
const ID_FIELD = 'id_cliente';

// Funciones y llamada de db 
module.exports = function (db) {

    async function uno(id) {
        return db.uno(TABLE_NAME, id,ID_FIELD);
    }
    async function precio (id){
        return db.uncampo(TABLE,id,ID_FIELD);
    }
    async function eliminar(id) {
        return db.carrito( id);
    }
    async function direcciones(id) {
        return db.direcciones( id);
    }
    async function confrimarPedido(id_cliente,id_direccion) {
        return db.confrimarPedido( id_cliente,id_direccion);
    }

    return {
        uno,
        precio,
        eliminar,
        direcciones,
        confrimarPedido
    };
};
