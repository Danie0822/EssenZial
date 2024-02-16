const Tabla = 'tb_admins';
const idTabla = 'id_admin';

module.exports = function (dbInyectada) {
    const db = dbInyectada || require('../../DB/mysql');

    async function todos() {
        return db.todos(Tabla);
    }

    async function uno(id) {
        return db.uno(Tabla, id);
    }

    async function eliminar(id) {
        return db.eliminar(Tabla, id, idTabla);
    }

    async function agregar(data) {
        return db.agregar(Tabla, data);
    }

    async function actualizar(data) {
        return db.actualizar(Tabla, data, idTabla);
    }

    return {
        todos,
        uno,
        eliminar,
        agregar,
        actualizar
    };
};
