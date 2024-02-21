const respuestas = require('../../red/errors');
const auth = require('../../auth');
const Tabla = 'tb_admins'; 
const Tabla1 = 'tb_clientes';

module.exports = function(dbInyectada) {
    const db = dbInyectada || require('../../DB/mysql');

    async function login(correo_admin, password) {
        try {
            console.log(correo_admin);
            const data = await db.query(Tabla, { correo_admin: correo_admin });
            if (data.length > 0 && data[0].clave_admin === password) {
                // Generar un token para administrador
                return { token: auth.asignarToken({ ...data[0] }, 'admin') };
            } else {
                return { error: 'Información inválida' };
            }
        } catch (error) {
            return { error: 'Error interno' };
        }
    }

    async function Cliente(correo_cliente, password) {
        try {
            const data = await db.query(Tabla1, { correo_cliente: correo_cliente });
            if (data.length > 0 && data[0].clave_cliente === password) {
                // Generar un token para cliente
                return { token: auth.asignarToken({ ...data[0] }, 'cliente') };
            } else {
                return { error: 'Información inválida' };
            }
        } catch (error) {
            return { error: 'Error interno' };
        }
    }
    
    return {
        login, 
        Cliente
    };
};
