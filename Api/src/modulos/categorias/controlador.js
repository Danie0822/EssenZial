const fs = require('fs').promises;

const TABLE_NAME = 'tb_categorias';
const ID_FIELD = 'id_categoria';

module.exports = function (db) {
    async function todos() {
        const categorias = await db.todos(TABLE_NAME);
        return categorias.map(categoria => ({
            ...categoria,
            imagen_categoria: categoria.imagen_categoria || null
        }));
    }

    async function uno(id) {
        const categoria = await db.uno(TABLE_NAME, id, ID_FIELD);
        return categoria && {
            ...categoria,
            imagen_categoria: categoria.imagen_categoria || null
        };
    }

    async function eliminar(id) {
        const categoria = await db.uno(TABLE_NAME, id, ID_FIELD);
        if (categoria && categoria[0].imagen_categoria) {
            try {
                await fs.unlink(categoria[0].imagen_categoria);
            } catch (error) {
                console.error('Error al eliminar la imagen:', error);
            }
        }
        return db.eliminar(TABLE_NAME, id, ID_FIELD);
    }

    async function agregar(nombre, filePath) {
        const newData = { nombre_categoria: nombre, imagen_categoria: filePath };
        return db.agregar(TABLE_NAME, newData);
    }

    async function actualizar(id, data) {
        const { nombre_categoria, imagen_categoria } = data;
        const categoria = await db.uno(TABLE_NAME, id, ID_FIELD);

        if (categoria && categoria[0] && categoria[0].imagen_categoria && imagen_categoria && imagen_categoria !== categoria[0].imagen_categoria) {
            try {
                await fs.unlink(categoria[0].imagen_categoria);
            } catch (error) {
                console.error('Error al eliminar la imagen anterior:', error);
            }
        }
        const newData = { nombre_categoria };
        if (imagen_categoria) {
            newData.imagen_categoria = imagen_categoria;
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
