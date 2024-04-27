const respuestas = require('../../red/respuestas');
class Validador {
    static validarCampo(valor, mensajeError, req, res, next) {
        if (!valor || valor.trim().length === 0) {
            respuestas.error(req, res, mensajeError, 401);
            return next('route');
        }
        return valor.trim();
    }

    static validarLongitud(valor, longitudMaxima, mensajeError, req, res, next) {
        if (typeof valor !== 'string' || (valor && (valor.trim().length < 3 || valor.trim().length > longitudMaxima))) {
            respuestas.error(req, res, mensajeError, 401);
            return next('route');
        }
        return valor.trim();
    }
    
    static validarCorreo(correo, mensajeError, req, res, next) {
        if (typeof correo !== 'string' || correo.trim().length < 5 || correo.trim().length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
            respuestas.error(req, res, mensajeError, 401);
            return next('route');
        }
        return correo.trim();
    }

    static validarNumeroEntero(numero, mensajeError, req, res, next) {
        if (!Number.isInteger(numero = parseInt(numero)) || numero <= 0) {
            respuestas.error(req, res, mensajeError, 401);
            return next('route');
        }
        return numero;
    }
}

module.exports = Validador;
