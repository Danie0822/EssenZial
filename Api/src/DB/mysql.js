const mysql = require('mysql');
const config = require('../config');
const { error } = require('../red/respuestas');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
};

let conexion;

function conectar() {
    conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) => {
        if (err) {
            console.log('[db err]', err);
            setTimeout(conectar, 200);
        } else {
            console.log('DB conectada uwu');
        }
    });

    conexion.on('error', err => {
        console.log('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            conectar();
        } else {
            // Manejar el error de manera adecuada
            error(res, 500, 'Error Interno');
        }
    });
}

conectar();

function ejecutarConsulta(sql, params) {
    return new Promise((resolve, reject) => {
        conexion.query(sql, params, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

function todos(tabla) {
    const sql = `SELECT * FROM ${tabla}`;
    return ejecutarConsulta(sql, []);
}

function uno(tabla, id, campoIdentificacion) {
    const sql = `SELECT * FROM ${tabla} WHERE ${campoIdentificacion} = ?`;
    return ejecutarConsulta(sql, [id]);
}

function agregar(tabla, data) {
    const sql = `INSERT INTO ${tabla} SET ?`;
    return ejecutarConsulta(sql, data);
}

function actualizar(tabla, data, campoIdentificacion, id ) {
    const sql = `UPDATE ${tabla} SET ? WHERE ${campoIdentificacion} = ?`;
    return ejecutarConsulta(sql, [data, id]);
}



function eliminar(tabla, id, nombreid) {
    const sql = `DELETE FROM ${tabla} WHERE ${nombreid} = ?`;
    return ejecutarConsulta(sql, [id]);
}

function query(tabla, consulta) {
    const sql = `SELECT * FROM ${tabla} WHERE ?`;
    return ejecutarConsulta(sql, consulta);
}
function ejecutarProcedimiento(nombreProcedimiento, parametros) {
    return new Promise((resolve, reject) => {
        let placeholders = '';
        if (parametros && parametros.length > 0) {
            placeholders = parametros.map(() => '?').join(',');
        }

        const callStatement = `CALL ${nombreProcedimiento}(${placeholders})`;

        conexion.query(callStatement, parametros, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = {
    todos,
    uno,
    agregar,
    eliminar,
    actualizar,
    query, 
    ejecutarProcedimiento
};
