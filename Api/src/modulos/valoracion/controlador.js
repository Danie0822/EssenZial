//Definimos los campos a usar y a mandar como parametro
const ID_FIELD = 'id_cliente';
const TABLE_VALORACIONES = 'tb_valoraciones';
const TABLE_NAME = 'vw_detalle_pedido_con_info'; 
//Exportamos los modulos para poder usarlos en las rutas
module.exports = function(db){
    async function valoraciones(id){
        return db.uno( TABLE_NAME,id,ID_FIELD);
    }
    async function insert(data) {
        return db.agregar(TABLE_VALORACIONES, data);
    }

    return{
        valoraciones, 
        insert
    };
};