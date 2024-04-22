const fs = require('fs').promises;

const TABLE_NAME = 'tb_inventarios';
const ID_FIELD = 'id_inventario';



module.exports = function(db){
    async function todos(){
        const inventarios = await db.todos(TABLE_NAME);
        return inventarios.map(inventario => ({
            ...inventario,
            imagen_producto: inventario.imagen_producto || null
        }));
    }

    async function uno(id){
        const inventario = await db.uno(TABLE_NAME, id, ID_FIELD);
        return inventario &&{
            ...inventario,
            imagen_producto: inventario.imagen_producto || null
        }
    }

    return{
        todos,
        uno
    };
};



