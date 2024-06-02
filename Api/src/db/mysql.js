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

//Query personalizada para seleccionar olor y todas gamas sin imagen
function querySelect(fields, tableName) {
    const sql = `SELECT ${fields.join(', ')} FROM ${tableName}`;
    return ejecutarConsulta(sql);
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

// Función para detalles pedidos
function datellesPedidos(tabla, id, campoIdentificacion) {
    const sql = `SELECT * FROM ?? WHERE ?? = ?`;
    return ejecutarConsulta(sql, [tabla, campoIdentificacion, id]);
}

//Funcion para obtener detalles para la parte de valoraciones
function detalleValoraciones(id) {
    const sql = `SELECT 
        iv.id_inventario,
        v.id_valoracion,
        iv.nombre_inventario,
        v.calificacion_producto,
        v.estado_comentario, 
        c.nombre_cliente 
        FROM tb_valoraciones v
        INNER JOIN tb_detalle_pedido dp ON v.id_detalle_pedido = dp.id_detalle_pedido
        INNER JOIN tb_inventarios iv ON dp.id_inventario = iv.id_inventario
        INNER JOIN tb_pedidos p ON dp.id_pedido = p.id_pedido
        INNER JOIN tb_direcciones n ON p.id_direccion = n.id_direccion
        INNER JOIN tb_clientes c ON n.id_cliente = c.id_cliente
        WHERE iv.id_inventario = ?`;

    return ejecutarConsulta(sql, id); // Pasar el SQL completo y el parámetro para el ID
}

function detalleInventario(id) {
    const sql = `SELECT i.id_inventario, i.nombre_inventario, i.cantidad_inventario, i.descripcion_inventario, i.precio_inventario, o.id_olor, o.nombre_olor, 
    s.id_categoria, s.nombre_categoria, a.id_marca, a.nombre_marca, e.id_descuento, e.cantidad_descuento
    FROM tb_inventarios i
    INNER JOIN tb_olores o ON i.id_olor = o.id_olor
    INNER JOIN tb_categorias s ON i.id_categoria = s.id_categoria
    INNER JOIN tb_marcas a ON i.id_marca = a.id_marca
    INNER JOIN tb_descuentos e ON  i.id_descuento = e.id_descuento
    WHERE i.id_inventario = ?;`

    return ejecutarConsulta(sql, id);
}

function estadoPedido(estado){
    const sql = `SELECT p.id_pedido, p.fecha_pedido, p.estado_pedido
    FROM tb_pedidos p
    WHERE p.estado_pedido = ?;`;
    return ejecutarConsulta(sql, estado);
}
function procediur (id, procs) {
    const sql = `CALL ?? (?);`;
    return ejecutarConsulta(sql, [id,procs]);

}
function procediurAgregar (cantidad_producto,costo_actual,id_inventario,id_cliente) {
    const sql = `CALL InsertarDetallePedido (?,?,?,?);`;
    return ejecutarConsulta(sql, [cantidad_producto,costo_actual,id_inventario,id_cliente]);

}
// Función para obtener un solo registro de una tabla por su ID
function uncampo(tabla, id, campoIdentificacion) {
    const sql = `SELECT total_pago FROM ?? WHERE ?? = ? AND estado_carrito = 'Carrito';`;
    return ejecutarConsulta(sql, [tabla, campoIdentificacion, id]);
}
function carrito (id) {
    const sql = `CALL eliminar_detalle_pedido (?);`;
    return ejecutarConsulta(sql, [id]);
}
function direcciones(consulta) {
    const sql = `SELECT * FROM vw_direcciones_cliente WHERE id_cliente = ?`;
    return ejecutarConsulta(sql, [ consulta]);
}

function confrimarPedido (id_cliente, id_direccion) {
    const sql = `CALL actualizar_pedido (?,?);`;
    return ejecutarConsulta(sql, [id_cliente, id_direccion]);
}
// Exportar las funciones para su uso fuera del módulo
module.exports = {
    todos,
    uno,
    agregar,
    eliminar,
    actualizar,
    query,
    querySelect,
    ejecutarProcedimiento,
    login,
    datellesPedidos,
    detalleValoraciones,
    detalleInventario,
    estadoPedido, 
    procediur,
    procediurAgregar,
    uncampo,
    carrito,
    direcciones,
    confrimarPedido
};
