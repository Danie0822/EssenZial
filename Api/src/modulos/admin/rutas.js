const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');

// Validaciones comunes para los campos de administradores
const validacionesAdmin = [
    body('nombre_admin').notEmpty().trim().isLength({ max: 255 }).withMessage('El nombre es requerido y debe tener como máximo 255 caracteres'),
    body('apellido_admin').notEmpty().trim().isLength({ max: 255 }).withMessage('El apellido es requerido y debe tener como máximo 255 caracteres'),
    body('correo_admin').notEmpty().trim().isEmail().withMessage('El correo electrónico debe ser válido y no puede estar vacío').isLength({ max: 255 }).withMessage('El correo electrónico debe tener como máximo 255 caracteres'),
    body('clave_admin').notEmpty().trim().isLength({ min: 6, max: 255 }).withMessage('La clave es requerida y debe tener al menos 6 caracteres y como máximo 255 caracteres')
];

// Validación específica para el ID en rutas de actualización y eliminación
const validacionIdUpdate = [
    body('id_categoria').notEmpty().isInt({ min: 1 }).withMessage('El ID debe ser un número entero mayor que cero')
];

const validacionId = [
    param('id').notEmpty().isInt({ min: 1 }).withMessage('El ID debe ser un número entero mayor que cero')
];

// Rutas
router.get('/', seguridad('admin'), todos);
router.get('/:id', seguridad('admin'), id);
router.delete('/delete/:id', seguridad('admin'), validacionId, validarDatos, eliminar);
router.post('/save', validacionesAdmin, validarDatos, seguridad('admin'), agregar);
router.put('/update', validacionIdUpdate, validacionesAdmin, validarDatos, seguridad('admin'), actualizar);

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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return respuestas.error(req, res, 'Error en la validación', 400, errors.array());
        }
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
