const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
router.get('/', todos);
router.get('/:id', uno);
router.delete('/delete/:id', eliminarPorId);

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

async function eliminarPorId(req, res, next) {
    try {
        await controlador.eliminar(req.params.id);
        respuestas.success(req, res, 'Elemento eliminado', 200);
    } catch (error) {
        next(error);
    }
}
module.exports = router;