const Tabla = 'tb_categorias';
const idTabla = 'id_categoria'; 
const fs = require('fs');
module.exports = function (dbInyectada) {
    const db = dbInyectada || require('../../DB/mysql');

    async function todos() {
        const categorias = await db.todos(Tabla);
        return categorias.map(categoria => {
            return {
                ...categoria,
                imagen_categoria: categoria.imagen_categoria ?  categoria.imagen_categoria : null
            };
        });
    }

    async function uno(id) {
        const categorias = await db.uno(Tabla, id, idTabla);
        if (categorias) {
            return {
                ...categorias,
                imagen_categoria: categorias.imagen_categoria ?   categorias.imagen_categoria : null
            };
        }
        return null; 
    }

    async function eliminar(id) {
        const categorias = await db.uno(Tabla, id, idTabla);
        if (categorias && categorias[0].imagen_categoria) {
            fs.unlinkSync(categorias[0].imagen_categoria);
        }
        return db.eliminar(Tabla, id, idTabla);
    }

    async function agregar(nombre, filePath) {
        const  nombre_categoria = nombre;
        const newData = { nombre_categoria, imagen_categoria: filePath }; 
        return db.agregar(Tabla, newData);
    }
    
    

    async function actualizar(id, data) {
        const { nombre_categoria, imagen_categoria } = data;
        const categoria = await db.uno(Tabla, id, idTabla);
    
        if (categoria && categoria[0] && categoria[0].imagen_categoria && imagen_categoria && imagen_categoria !== categoria[0].imagen_categoria) {
            // Eliminar la foto anterior del servidor
            fs.unlinkSync(categoria[0].imagen_categoria);
        }
    
        // Actualizar la información del cliente en la base de datos y pone en un nuevo array la info nueva 
        const newData = { nombre_categoria };
        if (imagen_categoria) {
            newData.imagen_categoria = imagen_categoria;
        }
        const resultado = await db.actualizar(Tabla, newData, idTabla, id);
    
        return resultado;
    }
    
    
    

    return {
        todos,
        uno,
        eliminar,
        agregar,
        actualizar
    };
};
