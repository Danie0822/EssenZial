const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');
const Validador = require('../recursos/validator');
const multerConfig = require('../recursos/upload');
const upload = multerConfig('inventarios');

// Middleware para validar el ID
const validarId = [
    param('id').notEmpty().isInt({ min: 1 }).withMessage('El ID debe ser un número entero mayor que cero')
];

//Validando los datos de la tabla inventario
const validarInventario = [
    body('nombre_inventario').notEmpty().trim().isLength({ max: 255 }).withMessage('El nombre del producto es requerido y debe tener como máximo 255 caracteres'),
    body('cantidad_inventario').notEmpty().isInt({ min: 1 }).withMessage('La cantidad de producto es requerida y debe ser mayor o igual a 1'),
    body('descripcion_inventario').notEmpty().trim().isLength({ max: 400 }).withMessage('La descripción del producto es requerida y deber tener máximo 400 caracteres')
]

// Middleware de validación específica para el ID en rutas de actualización y eliminación
const validarIdUpdate = [
    body('id_inventario').notEmpty().isInt({ min: 1 }).withMessage('El ID debe ser un número entero mayor que cero')
]

// Middleware de validación y manejo de errores centralizado
function validar(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return respuestas.error(req, res, 'Error en la validación', 410, errors.array());
    }
    next();
}

//Rutas de los endpoints
router.get('/', seguridad('admin'), todos);
router.get('/:id', seguridad('admin'), validarId, unoPorId);
router.get('/vistaPrueba/view', vistaProductos);
router.post('/save', seguridad('admin'), validarInventario, validar, agregar);
router.put('/update', seguridad('admin'), validarInventario, validar, actualizar);
router.delete('/delete/:id', seguridad('admin'), validarId, eliminar);


async function todos(req, res, next) {
    try {
        const inventario = await controlador.todos()
        respuestas.success(req, res, inventario, 200);
    } catch (error) {
        next(error);
    }
}

async function vistaProductos(req, res, next){
    try{
        
        const view = await controlador.todosProductos();
        respuestas.success(req, res, view, 200);
      
    } catch (error) {
        next(error);
    }
}


async function unoPorId(req, res, next) {
    try {
        const item = await controlador.uno(req.params.id);
        respuestas.success(req, res, item, 200);

    } catch (error) {
        next(error);
    }

}

async function agregar(req, res, next) {
    try {
        console.log(req.body);
        await controlador.agregar(req.body);
        respuestas.success(req, res, 'Inventario agregado', 200);

    } catch (error) {
        next(error);
    }
}

async function actualizar(req, res, next) {
    try {
        await controlador.actualizar(req.body);
        respuestas.success(req, res, 'Inventario actualizado correctamente', 200);
    } catch (error) {
        next(error);
    }
}

async function eliminar(req, res, next) {
    try {
        await controlador.eliminar(req.params.id);
        respuestas.success(req, res, 'Inventario eliminado', 200);

    } catch (error) {
        next(error);
    }
}



module.exports = router;