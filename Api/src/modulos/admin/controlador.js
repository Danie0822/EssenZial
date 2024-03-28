const Tabla = 'tb_admins';
const idTabla = 'id_admin';

module.exports = function (dbInyectada) {
    const db = dbInyectada || require('../../DB/mysql');

    async function todos() {
        return db.todos(Tabla);
    }

    async function uno(id) {
        return db.uno(Tabla, id, idTabla);
    }

    async function eliminar(id) {
        return db.eliminar(Tabla, id, idTabla);
    }

    async function agregar(data) {
        return db.agregar(Tabla, data);
    }

    async function actualizar(data) {
        const { nombre_admin, apellido_admin, correo_admin, clave_admin } = data;
        const Newdata = {
            nombre_admin,
            apellido_admin,
            correo_admin,
            clave_admin
        };
        return db.actualizar(Tabla, Newdata, idTabla, data.id_categoria);
    }

    return {
        todos,
        uno,
        eliminar,
        agregar,
        actualizar
    };
};
