const respuestas = require('../../red/errors');
const auth = require('../../auth');
const Tabla = 'tb_admins'; 

module.exports = function(dbInyectada) {
    const db = dbInyectada || require('../../DB/mysql');

    async function login(correo_admin, password) {
        try {
            const data = await db.query(Tabla, { correo_admin: correo_admin });
            if (data.length > 0 && data[0].clave_admin === password) {
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
