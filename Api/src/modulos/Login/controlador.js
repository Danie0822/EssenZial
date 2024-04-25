// Variable de token 
const auth = require('../../auth');

module.exports = function(dbInyectada) {
    const db = dbInyectada || require('../../DB/mysql');
    // Funcion de login 
    async function login(tabla, correo, password, tipo) {
        try {
            const usuario = await db.login(tabla, correo, password);
            // if para si no se encontro el usuario 
            if (usuario && usuario.error) {
                return { error: usuario.error };
            // Asignar el token si se encontro el usuario 
            } else if (usuario && usuario.usuario) {
                const token = auth.asignarToken(usuario.usuario, tipo);
                return { token, usuario: usuario.usuario };
            } else {
                return { error: 'Usuario no encontrado' };
            }
        } catch (error) {
            return { error: 'Error interno' };
        }
    }
    
    return {
        // Dos fuciones flecha para saber si es un cliente o administrador 
        loginAdmin: async (correo_admin, password) => login('tb_admins', correo_admin, password, 'admin'),
        loginCliente: async (correo_cliente, password) => login('tb_clientes', correo_cliente, password, 'cliente')
    };
};
