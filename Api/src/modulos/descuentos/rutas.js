const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');
const Validador = require('../recursos/validator');
const multerConfig = require('../recursos/upload');
const upload = multerConfig('descuentos');


// Middleware para validar el ID
const validarId = [
    param('id').notEmpty().isInt({ min: 1 }).withMessage('El ID debe ser un número entero mayor que cero')
];



// Middleware de validación específica para el ID en rutas de actualización y eliminación
const validarIdUpdate = [
    body('id_descuentos').notEmpty().isInt({ min: 1 }).withMessage('El ID debe ser un número entero mayor que cero')
]

// Middleware de validación y manejo de errores centralizado
function validar(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return respuestas.error(req, res, 'Error en la validación', 400, errors.array());
    }
    next();
}

//Rutas de los endpoints
router.get('/', seguridad('admin'), todos);
router.get('/especifico', seguridad('admin'), especifico);
router.post('/agregar', seguridad('admin'), validar, agregar);


async function todos(req, res, next){
    try{
            const descuento = await controlador.todos();
            respuestas.success(req, res, descuento, 200);
    }catch(error){
        next(error);
    }
}

async function especifico(req, res, next){
    try{
        const descuentoEspecifico = await controlador.querySelect();
        respuestas.success(req, res, descuentoEspecifico, 200);
    }catch(error){
        next(error);
    }
}

async function agregar(req, res, next){
    try{
        await controlador.agregar(req.body);
        respuestas.success(req, res, 'Descuento agregado', 200);

    }catch(error){
            next(error);
    }
}

module.exports = router;

