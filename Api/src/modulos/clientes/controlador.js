const Tabla = 'clientes';
const fs = require('fs');

module.exports = function (dbInyectada) {
    const db = dbInyectada || require('../../DB/mysql');

    async function todos() {
        const clientes = await db.todos(Tabla);
        return clientes.map(cliente => {
            return {
                ...cliente,
                ruta_imagen: cliente.ruta_imagen ? '/uploads/' + cliente.ruta_imagen : null
            };
        });
    }

    async function uno(id) {
        const cliente = await db.uno(Tabla, id);
        if (cliente) {
            return {
                ...cliente,
                ruta_imagen: cliente.ruta_imagen ? '/uploads/' + cliente.ruta_imagen : null
            };
        }
        return null; // Cliente no encontrado
    }

    async function eliminar(id) {
        const cliente = await db.uno(Tabla, id);
        if (cliente && cliente[0].ruta_imagen) {
            fs.unlinkSync(cliente[0].ruta_imagen);
        }
        return db.eliminar(Tabla, id);
    }

    async function agregar(data, filePath) {
        const { nombre, edad, profesion } = data;
        const newData = { nombre, edad, profesion, ruta_imagen: filePath }; // Usar el nombre correcto de la columna
        console.log(newData);
        return db.agregar(Tabla, newData);
    }
    
    

    async function actualizar(id, data) {
        const { nombre, edad, profesion, ruta_imagen } = data;
        const cliente = await db.uno(Tabla, id);
        
        // Verificar si hay una nueva foto y si la ruta de la imagen anterior está definida correctamente
        if (cliente && cliente[0].ruta_imagen && ruta_imagen && ruta_imagen !== cliente[0].ruta_imagen) {
            // Eliminar la foto anterior del servidor
            fs.unlinkSync(cliente[0].ruta_imagen);
        }
    
        // Actualizar la información del cliente en la base de datos
        const newData = { id, nombre, edad, profesion };
        if (ruta_imagen) {
            newData.ruta_imagen = ruta_imagen;
        }
        const resultado = await db.actualizar(Tabla, newData);
    
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
