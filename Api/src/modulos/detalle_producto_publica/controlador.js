const fs = require('fs').promises;
// Nombres de campos de la tabla 
const TABLE_NAME = 'vw_perfume_info';
const PROCEDIUR_ADMIN = 'InsertarDetallePedido';
const VIEW_NAME = 'vw_productos_detalle';
const VIEW_IMAGEN = 'vw_imagenes_detalle';
const VIEW_VALORACIONES = 'vw_valoraciones_producto';
const PROCEDIUR = 'sp_productos_relacionados' ;
const ID_FIELD_VIEW = 'id_inventario'; 
const ID_FIELD_VALORACIONES = 'identificador';
const ID_FIELD = 'id_producto';
const VISTA_PRODUCTOS = 'vw_inventario_detalles';
const VISTA_VALORACIONES = 'valoraciones_producto' ;
const ID_PRODUCTOS = 'identificador';  
const ID_PR = 'id_producto' ;

// Funciones y llamada de db 
module.exports = function (db) {

    async function uno(id) {
        return db.uno(TABLE_NAME, id, ID_FIELD);
    }
    async function detalle(id) {
        return db.uno(VIEW_NAME, id, ID_FIELD);
    }
    async function imagenes(id) {
        return db.uno(VIEW_IMAGEN, id, ID_FIELD_VIEW);
    }
    async function valoracion(id) {
        return db.uno(VIEW_VALORACIONES, id, ID_FIELD_VALORACIONES);
    }
    async function similares(id) {
        return db.procediur(PROCEDIUR, id );
    }
    async function insertar (cantidad_producto, costo_actual, id_inventario, id_cliente) { 
        return db.procediurAgregar(cantidad_producto, costo_actual, id_inventario, id_cliente);
    }
    async function todosProductos(id){
        return db.uno(VISTA_PRODUCTOS, id, ID_PRODUCTOS);
    }
    async function validaciones(id){
        return db.uno(VISTA_VALORACIONES, id, ID_PR);
    }
    return {
        uno,
        detalle,
        imagenes,
        valoracion,
        similares,
        insertar,
        todosProductos,
        validaciones
    };
};
