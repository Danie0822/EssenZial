const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./controlador');

// Middleware de validación de correo
const validarCorreo = [
    body('destinatario').notEmpty().isEmail().withMessage('El destinatario debe ser un correo electrónico válido'),
    body('codigoRecuperacion').optional().trim()
];

// Middleware de validación y manejo de errores centralizado
function validar(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return respuestas.error(req, res, 'Error en la validación', 400, errors.array());
    }
    next();
}

// Ruta para enviar correo
router.post('/enviar', validarCorreo, validar, correoEnviar);

async function correoEnviar(req, res, next) {
    try {
        await controlador.enviar(req, res, next);
        respuestas.success(req, res, "Correo enviado correctamente", 200);
    } catch (error) {
        respuestas.error(req, res, 'Error al enviar el correo', 500, error);
    }
}

module.exports = router;
