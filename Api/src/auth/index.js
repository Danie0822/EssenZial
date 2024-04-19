const jwt = require('jsonwebtoken');
const config = require('../config');

const secrets = {
    admin: config.jwt.secretAdmin,
    cliente: config.jwt.secretCliente
};

function asignarToken(data, tipoUsuario) {
    if (!secrets[tipoUsuario]) {
        throw new Error('Tipo de usuario inválido');
    }

    const tokenData = { ...data, userType: tipoUsuario };
    const expiresIn = config.jwt.expiresIn || '120m';
    return jwt.sign(tokenData, secrets[tipoUsuario], { expiresIn });
}

function verificarToken(token, tipoUsuario) {
    if (!secrets[tipoUsuario]) {
        throw new Error('Tipo de usuario inválido');
    }

    try {
        const decoded = jwt.verify(token, secrets[tipoUsuario]);
        return decoded;
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
}

module.exports = {
    asignarToken,
    verificarToken
};
