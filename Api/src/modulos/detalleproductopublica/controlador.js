const fs = require('fs').promises;
// Nombres de campos de la tabla 
const TABLE_NAME = 'vw_perfume_info';
const VIEW_NAME = 'vw_productos_detalle';
const ID_FIELD = 'id_producto';
// Funciones y llamada de db 
module.exports = function (db) {

    async function uno(id) {
        return db.uno(TABLE_NAME, id, ID_FIELD);
    }
    async function detalle(id) {
        return db.uno(VIEW_NAME, id, ID_FIELD);
    }

    return {
        uno,
        detalle,
    };
};
