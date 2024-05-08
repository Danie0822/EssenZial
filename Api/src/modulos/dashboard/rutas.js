// Variables de depedencias 
const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');


// Rutas
router.get('/', seguridad('admin'), todos);
router.get('/ofertas', seguridad('admin'), ofertas);

// Funciones
async function todos(req, res, next) {
    try {
        const pedidos = await controlador.todos();
        respuestas.success(req, res, pedidos, 200);
    } catch (error) {
        next(error);
    }
}
async function ofertas(req, res, next) {
    try {
        const pedidos = await controlador.ofertas();
        respuestas.success(req, res, pedidos, 200);
    } catch (error) {
        next(error);
    }
}

module.exports = router;
