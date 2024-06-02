const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');

router.get('/:id', obtenerPorId);
router.get('/direcciones/:id', direcciones);
router.get('/campo/:id', uncampo);
router.delete('/delete/:id', eliminarPorId);

async function obtenerPorId(req, res, next) {
    try {
        const item = await controlador.uno(req.params.id);
        respuestas.success(req, res, item, 200);
    } catch (error) {
        next(error);
    }
}
async function uncampo(req, res, next) {
    try {
        const item = await controlador.precio(req.params.id);
        respuestas.success(req, res, item, 200);
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
async function direcciones(req, res, next) {
    try {
        const item = await controlador.direcciones(req.params.id);
        respuestas.success(req, res, item, 200);
    } catch (error) {
        next(error);
    }
}
module.exports = router;
