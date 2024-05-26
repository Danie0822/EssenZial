const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');
const Validador = require('../recursos/validator');

router.get('/:id', obtenerPorId);
router.get('/detalle/:id', detalle);
router.get('/imagenes/:id', imagenes);
router.get('/valoraciones/:id', valoraciones);

async function obtenerPorId(req, res, next) {
    try {
        const item = await controlador.uno(req.params.id);
        respuestas.success(req, res, item, 200);
    } catch (error) {
        next(error);
    }
}
async function detalle(req, res, next) {
    try {
        const item = await controlador.detalle(req.params.id);
        respuestas.success(req, res, item, 200);
    } catch (error) {
        next(error);
    }
}
async function imagenes(req, res, next) {
    try {
        const item = await controlador.imagenes(req.params.id);
        respuestas.success(req, res, item, 200);
    } catch (error) {
        next(error);
    }
}
async function valoraciones(req, res, next) {
    try {
        const item = await controlador.valoracion(req.params.id);
        respuestas.success(req, res, item, 200);
    } catch (error) {
        next(error);
    }
}
module.exports = router;
