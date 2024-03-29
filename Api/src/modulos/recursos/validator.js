const respuestas = require('../../red/respuestas');

class Validador {
    static validarCampo(valor, mensajeError, req, res, next) {
        if (!valor || valor.trim().length === 0) {
            respuestas.error(req, res, mensajeError, 400);
            return next('route');
        }
        return valor.trim();
    }

    static validarLongitud(valor, longitudMaxima, mensajeError, req, res, next) {
        if (valor.trim().length > longitudMaxima) {
            respuestas.error(req, res, mensajeError, 400);
            return next('route');
        }
        return valor.trim();
    }
}

module.exports = Validador;
