const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');
const clientes = require('../clientes');

// Rutas
router.get('/', todos);

// Funciones
async function todos(req, res, next) {
    try {
        const ultimosInventario = await controlador.todos();
        respuestas.success(req, res, ultimosInventario, 200);
    } catch (error) {
        next(error);
    }
}

module.exports = router;