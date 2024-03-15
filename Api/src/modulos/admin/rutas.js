const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');

// Funciones de validación comunes
const validacionesComunes = [
    body('nombre_admin').notEmpty().trim().isLength({ max: 255 }),
    body('apellido_admin').notEmpty().trim().isLength({ max: 255 }),
    body('correo_admin').isEmail().trim().isLength({ max: 255 }),
    body('clave_admin').isLength({ min: 6 }).trim().isLength({ max: 255 })
];

// Rutas
router.get('/', seguridad('admin'), todos);
router.get('/:id', seguridad('admin'), id);
router.delete('/delete/:id', seguridad('admin'), eliminar);
router.post('/save', validacionesComunes, validarDatos, seguridad('admin'), agregar);
router.put('/update', validacionesComunes, validarDatos, seguridad('admin'), actualizar);

// Funciones

async function todos(req, res, next) {
    try {
        const items = await controlador.todos();
        respuestas.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
}

async function id(req, res, next) {
    try {
        const item = await controlador.uno(req.params.id);
        respuestas.success(req, res, item, 200);
    } catch (error) {
        next(error);
    }
}

async function eliminar(req, res, next) {
    try {
        await controlador.eliminar(req.params.id);
        respuestas.success(req, res, 'Elemento eliminado', 200);
    } catch (error) {
        next(error);
    }
}

async function agregar(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return respuestas.error(req, res, 'Error en la validación', 400, errors.array());
        }
        const item = await controlador.agregar(req.body);
        respuestas.success(req, res, 'Elemento insertado', 200);
    } catch (error) {
        next(error);
    }
}

async function actualizar(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return respuestas.error(req, res, 'Error en la validación', 400, errors.array());
        }
        const Items = await controlador.actualizar(req.body); 
        respuestas.success(req, res, 'Elemento actualizado', 200);
    } catch (error) {
        next(error);
    }
}

function validarDatos(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return respuestas.error(req, res, 'Error en la validación', 400, errors.array());
    }
    next();
}

module.exports = router;
