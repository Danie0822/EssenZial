const jwt = require('jsonwebtoken');
const config = require('../config');
const secret = config.jwt.secret;

function asignarToken(data) {
    return jwt.sign(data, secret, { expiresIn: '1h' }); // Agregar tiempo de expiración
}

function verificarToken(token) {
    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
}

function confirmarToken(req) {
    const decodificado = decodificarCabecera(req);
    return decodificado;
}

function obtenerToken(autorizacion) {
    if (!autorizacion) {
        throw new Error('No se proporcionó un token');
    }
    if (!autorizacion.startsWith('Bearer ')) {
        throw new Error('Formato de token inválido');
    }

    return autorizacion.substring(7);
}

function decodificarCabecera(req) {
    const autorizacion = req.headers.authorization || '';
    const token = obtenerToken(autorizacion);
    const decodificado = verificarToken(token);
    return decodificado;
}

module.exports = {
    asignarToken,
    confirmarToken
};
