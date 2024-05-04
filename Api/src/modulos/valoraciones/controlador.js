//Definimos los campos a usar y a mandar como parametro
const ID_FIELD = 'id_inventario';

//Exportamos los modulos para poder usarlos en las rutas
module.exports = function(db){
    async function valoraciones(id){
        return db.detalleValoraciones(id, ID_FIELD);
    }
    return{
        valoraciones
    };
};