// Importación del módulo 'respuestas' para manejar las respuestas HTTP
const respuestas = require('../../red/respuestas');
// Definición de la clase Validador
class Validador {
    // Método estático para validar campos no vacíos
    static validarCampo(valor, mensajeError, req, res, next) {
        if (!valor || valor.trim().length === 0) {
            respuestas.error(req, res, mensajeError, 401);
            return next('route');
        }
        return valor.trim();
    }
    // Método estático para validar la longitud de una cadena
    static validarLongitud(valor, longitudMaxima, mensajeError, req, res, next) {
        if (typeof valor !== 'string' || (valor && (valor.trim().length < 3 || valor.trim().length > longitudMaxima))) {
            respuestas.error(req, res, mensajeError, 401);
            return next('route');
        }
        return valor.trim();
    }
    // Método estático para validar un correo electrónico
    static validarCorreo(correo, mensajeError, req, res, next) {
        if (typeof correo !== 'string' || correo.trim().length < 5 || correo.trim().length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
            respuestas.error(req, res, mensajeError, 401);
            return next('route');
        }
        return correo.trim();
    }
    // Método estático para validar un valor booleano
    static validarBooleano(valor, mensajeError, req, res, next) {
        if (typeof valor !== 'boolean') {
            respuestas.error(req, res, mensajeError, 401);
            return next('route');
        }
        return valor;
    }
    // Método estático para validar un número entero positivo
    static validarNumeroEntero(numero, mensajeError, req, res, next) {
        if (!Number.isInteger(numero = parseInt(numero)) || numero <= 0) {
            respuestas.error(req, res, mensajeError, 401);
            return next('route');
        }
        return numero;
    }
}
// Exportar la clase Validador para su uso en otros archivos
module.exports = Validador;
