const respuestas = require('../../red/errors');
const auth = require('../../auth');
const Tabla = 'Usuarios'; 

module.exports = function(dbInyectada) {
    const db = dbInyectada || require('../../DB/mysql');

    async function login(usuario, password) {
        try {
            const data = await db.query(Tabla, { usuarios: usuario });
            if (data.length > 0 && data[0].clave === password) {
                // Generar un token 
                return { token: auth.asignarToken({ ...data[0] }) };
            } else {
                return { error: 'Información inválida' };
            }
        } catch (error) {
            return { error: 'Error interno' };
        }
    }
    
    return {
        login
    };
};
