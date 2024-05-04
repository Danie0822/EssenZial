const fs = require('fs').promises;
const ID_FIELD = 'id_imagen';
const TABLE_NAME = 'tb_imagenes';
const ID_INVENTARIO = 'id_inventario';

module.exports = function(db){
    async function todos() {
        const imagenes = await db.todos(TABLE_NAME);
        return imagenes.map(imagenes => ({
            ...imagenes,
            ruta_imagen: imagenes.ruta_imagen || null
        }));
    }

    async function uno(id){
        const imagenes = await db.uno(TABLE_NAME, id, ID_INVENTARIO);
        return imagenes && {
            ...imagenes,
            ruta_imagen: imagenes.ruta_imagen || null
        };
    }

    async function unoPorID(id){
        const imagenes = await db.uno(TABLE_NAME, id, ID_FIELD);
        return imagenes && {
            ...imagenes,
            ruta_imagen: imagenes.ruta_imagen || null
        };
    }

    async function agregar(filePath, id_inventario){
        const data = {ruta_imagen: filePath, id_inventario: id_inventario };
        return db.agregar(TABLE_NAME, data);
    }

    async function actualizar(id, data){
        const { id_inventario, ruta_imagen } = data;
        const imagen = await db.uno(TABLE_NAME, id, ID_FIELD);

        if (imagen && imagen[0] && imagen[0].ruta_imagen && ruta_imagen && ruta_imagen !== imagen[0].ruta_imagen) {
            try {
                await fs.unlink(imagen[0].ruta_imagen);
            } catch (error) {
                console.error('Error al eliminar la imagen anterior:', error);
            }
        }
        const newData = { id_inventario };
        if (ruta_imagen) {
            newData.ruta_imagen = ruta_imagen;
        }
        const resultado = await db.actualizar(TABLE_NAME, newData, ID_FIELD, id);

        return resultado;
    }

    async function eliminar(id){
        const imagen = await db.uno(TABLE_NAME, id, ID_FIELD);
        if(imagen && imagen[0].ruta_imagen){
            try{
                await fs.unlink(imagen[0].ruta_imagen);
            }catch(error){
                console.error('Error al eliminar la imagen', error);
            }
        }
        return db.eliminar(TABLE_NAME, id, ID_FIELD);
    }

    return{
        todos, 
        uno,
        unoPorID,
        agregar, 
        actualizar,
        eliminar
    }


}
