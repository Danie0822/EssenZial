const fs = require('fs').promises;
// Nombres de campos de la tabla 
const TABLE_NAME = 'tb_marcas';
const ID_FIELD = 'id_marca';
// Funciones y llamada de db 
module.exports = function (db) {
    async function todos() {
        const marcas = await db.todos(TABLE_NAME);
        return marcas.map(marca => ({
            ...marca,
            imagen_marca: marca.imagen_marca || null
        }));
    }

    async function uno(id) {
        const marcas = await db.uno(TABLE_NAME, id, ID_FIELD);
        return marcas && {
            ...marcas,
            imagen_marca: marcas.imagen_marca || null
        };
    }

    async function eliminar(id) {
        const marca = await db.uno(TABLE_NAME, id, ID_FIELD);
        if (marca && marca[0].imagen_marca) {
            try {
                await fs.unlink(marca[0].imagen_marca);
            } catch (error) {
                console.error('Error al eliminar la imagen:', error);
            }
        }
        return db.eliminar(TABLE_NAME, id, ID_FIELD);
    }

    async function agregar(nombre, filePath) {
        const newData = { nombre_marca: nombre, imagen_marca: filePath };
        return db.agregar(TABLE_NAME, newData);
    }

    async function actualizar(id, data) {
        const { nombre_marca, imagen_marca } = data;
        const marcas = await db.uno(TABLE_NAME, id, ID_FIELD);

        if (marcas && marcas[0] && marcas[0].imagen_marca && imagen_marca && imagen_marca !== marcas[0].imagen_marca) {
            try {
                await fs.unlink(marcas[0].imagen_marca);
            } catch (error) {
                console.error('Error al eliminar la imagen anterior:', error);
            }
        }
        const newData = { nombre_marca };
        if (imagen_marca) {
            newData.imagen_marca = imagen_marca;
        }
        const resultado = await db.actualizar(TABLE_NAME, newData, ID_FIELD, id);

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
