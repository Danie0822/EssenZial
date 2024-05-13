//Definimos los campos a usar y a mandar como parametro
const ID_FIELD = 'id_inventario';
const idValoraciones = 'id_valoracion';
const TABLE_NAME = 'tb_valoraciones'; 
//Exportamos los modulos para poder usarlos en las rutas
module.exports = function(db){
    async function valoraciones(id){
        return db.detalleValoraciones(id, ID_FIELD);
    }
    async function actualizar(data) {
        const { id_valoracion, ...restoDatos } = data;
        return db.actualizar(TABLE_NAME, restoDatos, idValoraciones, id_valoracion);
    }

    return{
        valoraciones, 
        actualizar
    };
};