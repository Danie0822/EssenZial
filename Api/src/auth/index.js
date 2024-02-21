const jwt = require('jsonwebtoken');
const config = require('../config');
const secretAdmin = config.jwt.secretAdmin;
const secretCliente = config.jwt.secretCliente;

function asignarToken(data, tipoUsuario) {
    let secret;
    if (tipoUsuario === 'admin') {
        secret = secretAdmin;
    } else if (tipoUsuario === 'cliente') {
        secret = secretCliente;
    } else {
        throw new Error('Tipo de usuario inválido');
    }

    const tokenData = { ...data, userType: tipoUsuario };
    return jwt.sign(tokenData, secret, { expiresIn: '60m' });
}

function verificarToken(token, tipoUsuario) {
    let secret;
    if (tipoUsuario === 'admin') {
        secret = secretAdmin;
    } else if (tipoUsuario === 'cliente') {
        secret = secretCliente;
    } else {
        throw new Error('Tipo de usuario inválido');
    }

    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
}

module.exports = {
    asignarToken,
    verificarToken
};
