const jwt = require('jsonwebtoken');
const config = require('../config');

const secrets = {
    admin: config.jwt.secretAdmin,
    cliente: config.jwt.secretCliente
};

function validarTipoUsuario(tipoUsuario) {
    if (!secrets[tipoUsuario]) {
        throw new Error('Tipo de usuario inválido');
    }
}

function asignarToken(data, tipoUsuario) {
    validarTipoUsuario(tipoUsuario);

    const tokenData = { ...data, userType: tipoUsuario };
    const expiresIn = config.jwt.expiresIn || '120m';
    return jwt.sign(tokenData, secrets[tipoUsuario], { expiresIn });
}

function verificarToken(token, tipoUsuario) {
    validarTipoUsuario(tipoUsuario);
    try {
        return jwt.verify(token, secrets[tipoUsuario]);
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
}

module.exports = {
    asignarToken,
    verificarToken
};
