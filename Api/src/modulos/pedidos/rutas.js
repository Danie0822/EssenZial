const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const seguridad = require('../seguridad/seguridad');
const controlador = require('./index');

//endpoint
router.get('/',seguridad('admin'), todos);
router.get('/:id',seguridad('admin'), uno);
router.get('/detalle/:id',seguridad('admin'), detallePedido);
router.delete('/delete/:id',seguridad('admin'), eliminarPorId);
router.put('/update',seguridad('admin'), actualizar);


// Middleware para validar el ID
function validarID(id, req, res, next) {
    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return next('route');
    }
    return id;
}
// Funciones
async function todos(req, res, next) {
    try {
        const pedidos = await controlador.todos();
        respuestas.success(req, res, pedidos, 200);
    } catch (error) {
        next(error);
    }
}

async function uno(req, res, next) {
    try {
        const pedidos = await controlador.uno(req.params.id);
        respuestas.success(req, res, pedidos, 200);
    } catch (error) {
        next(error);
    }
}

async function detallePedido(req, res, next) {
    try {
        const pedidos = await controlador.detallePedido(req.params.id);
        respuestas.success(req, res, pedidos, 200);
    } catch (error) {
        next(error);
    }
}

async function eliminarPorId(req, res, next) {
    try {
        const id = validarID(req.params.id, req, res, next);
        await controlador.eliminar(id);
        respuestas.success(req, res, 'Elemento eliminado', 200);
    } catch (error) {
        next(error);
    }
}

async function actualizar(req, res, next) {
    try {
        await controlador.actualizar(req.body);
        respuestas.success(req, res, 'Elemento actualizado', 200);
    } catch (error) {
        next(error);
    }
}

module.exports = router;