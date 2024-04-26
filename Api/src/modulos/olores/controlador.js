const fs = require('fs').promises;

const TABLE_NAME = 'tb_olores';
const ID_FIELD = 'id_olor';

module.exports = function (db) {
    async function todos() {
        const olor = await db.todos(TABLE_NAME);
        return olor.map(olores => ({
            ...olores,
            imagen_olor: olores.imagen_olor || null
        }));
    }

    async function uno(id) {
        const olor = await db.uno(TABLE_NAME, id, ID_FIELD);
        return olor && {
            ...olor,
            imagen_olor: olor.imagen_olor || null
        };
    }

    async function eliminar(id) {
        const olor = await db.uno(TABLE_NAME, id, ID_FIELD);
        if (olor && olor[0].imagen_olor) {
            try {
                await fs.unlink(olor[0].imagen_olor);
            } catch (error) {
                console.error('Error al eliminar la imagen:', error);
            }
        }
        return db.eliminar(TABLE_NAME, id, ID_FIELD);
    }

    async function agregar(nombre, filePath) {
        const newData = { nombre_olor: nombre, imagen_olor: filePath };
        return db.agregar(TABLE_NAME, newData);
    }

    async function actualizar(id, data) {
        const { nombre_olor, imagen_olor } = data;
        const olor = await db.uno(TABLE_NAME, id, ID_FIELD);

        if (olor && olor[0] && olor[0].imagen_olor && imagen_olor && imagen_olor !== olor[0].imagen_olor) {
            try {
                await fs.unlink(olor[0].imagen_olor);
            } catch (error) {
                console.error('Error al eliminar la imagen anterior:', error);
            }
        }
        const newData = { nombre_olor };
        if (imagen_olor) {
            newData.imagen_olor = imagen_olor;
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
