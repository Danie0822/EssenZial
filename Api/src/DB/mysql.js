const mysql = require('mysql');
const config = require('../config');
const { error } = require('../red/respuestas');

// Crear un pool de conexiones
const pool = mysql.createPool({
    connectionLimit: 10, // Ajustar según tus necesidades
    ...config.mysql
});


// Función para ejecutar consultas preparadas
function ejecutarConsulta(sql, params) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
// Función para obtener todos los registros de una tabla
function todos(tabla) {
    const sql = `SELECT * FROM ??`;
    return ejecutarConsulta(sql, [tabla]);
}

// Función para obtener un solo registro de una tabla por su ID
function uno(tabla, id, campoIdentificacion) {
    const sql = `SELECT * FROM ?? WHERE ?? = ?`;
    return ejecutarConsulta(sql, [tabla, campoIdentificacion, id]);
}

// Función para agregar un nuevo registro a una tabla
function agregar(tabla, data) {
    const sql = `INSERT INTO ?? SET ?`;
    return ejecutarConsulta(sql, [tabla, data]);
}

// Función para actualizar un registro en una tabla
function actualizar(tabla, data, campoIdentificacion, id) {
    const sql = `UPDATE ?? SET ? WHERE ?? = ?`;
    return ejecutarConsulta(sql, [tabla, data, campoIdentificacion, id]);
}

// Función para eliminar un registro de una tabla
function eliminar(tabla, id, nombreid) {
    const sql = `DELETE FROM ?? WHERE ?? = ?`;
    return ejecutarConsulta(sql, [tabla, nombreid, id]);
}

// Función para ejecutar una consulta personalizada en una tabla
function query(tabla, consulta) {
    const sql = `SELECT * FROM ?? WHERE ?`;
    return ejecutarConsulta(sql, [tabla, consulta]);
}

// Función para ejecutar un procedimiento almacenado
function ejecutarProcedimiento(nombreProcedimiento, parametros) {
    return new Promise((resolve, reject) => {
        let placeholders = '';
        if (parametros && parametros.length > 0) {
            placeholders = parametros.map(() => '?').join(',');
        }

        const callStatement = `CALL ${nombreProcedimiento}(${placeholders})`;

        pool.query(callStatement, parametros, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
// Función para el login 
async function login(tabla, correo, clave) {
    try {
        const tipoUsuario = tabla === 'tb_clientes' ? 'cliente' : 'admin';
        const columnaCorreo = `correo_${tipoUsuario}`;
        const columnaClave = `clave_${tipoUsuario}`;

        const sql = `SELECT * FROM ?? WHERE ?? = ? AND ?? = ? LIMIT 1`;
        const result = await ejecutarConsulta(sql, [tabla, columnaCorreo, correo, columnaClave, clave]);

        if (result.length > 0) {
            return { usuario: result[0] };
        } else {
            return { error: 'Credenciales inválidas' };
        }
    } catch (error) {
        return { error: 'Error interno' };
    }
}


// Exportar las funciones para su uso fuera del módulo
module.exports = {
    todos,
    uno,
    agregar,
    eliminar,
    actualizar,
    query,
    ejecutarProcedimiento,
    login
};
