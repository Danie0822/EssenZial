const auth = require('../../auth');

module.exports = function(dbInyectada) {
    const db = dbInyectada || require('../../DB/mysql');

    async function login(tabla, correo, password, tipo) {
        try {
            const usuario = await db.login(tabla, correo, password);
            if (usuario) {
                return { token: auth.asignarToken(usuario, tipo) };
            } else {
                return { error: 'Información inválida' };
            }
        } catch (error) {
            return { error: 'Error interno' };
        }
    }

    return {
        loginAdmin: async (correo_admin, password) => login('tb_admins', correo_admin, password, 'admin'),
        loginCliente: async (correo_cliente, password) => login('tb_clientes', correo_cliente, password, 'cliente')
    };
};
