const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');

router.get('/:id', obtenerPorId);
router.get('/detalle/:id', detalle);
router.get('/imagenes/:id', imagenes);
router.get('/valoraciones/:id', valoraciones);
router.get ('/similares/:id',similares);
router.post('/save',insertar);

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
async function similares(req, res, next) {
    try {
        const item = await controlador.similares(req.params.id);
        respuestas.success(req, res, item, 200);
    } catch (error) {
        next(error);
    }
}
async function insertar(req, res, next) {
    try {
        const {cantidad_producto,costo_actual,id_inventario,id_cliente}= req.body
        const item = await controlador.insertar(cantidad_producto,costo_actual,id_inventario,id_cliente);
        respuestas.success(req, res, item, 200);
    } catch (error) {
        next(error);
    }
}
module.exports = router;
