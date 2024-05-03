// variables de dependecias 
const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');
const Validador = require('../recursos/validator');

// Middleware para validar el formato de los datos
function validarDatos(nombreAdmin, apellidoAdmin, correoAdmin, claveAdmin, req, res, next) {
    const nombreValidado = Validador.validarLongitud(nombreAdmin, 255, 'El nombre debe ser obligatorio', req, res, next);
    const apellidoValidado = Validador.validarLongitud(apellidoAdmin, 255, 'El apellido debe ser obligatorio', req, res, next);
    const correo = Validador.validarCorreo(correoAdmin, 'El correo debe ser un formato correo', req, res, next);
    const contra = Validador.validarLongitud(claveAdmin, 300, 'El clave debe ser obligatorio', req, res, next);
    return { nombre_admin: nombreValidado, apellido_admin: apellidoValidado, correo_admin: correo, clave_admin: contra };
}
// Middleware para validar el formato de los datos a actualizar 
function validarFormatoActualizar(nombreAdmin, apellidoAdmin, correoAdmin, id, req, res, next) {
    const nombreValidado = Validador.validarLongitud(nombreAdmin, 255, 'El nombre debe ser obligatorio', req, res, next);
    const apellidoValidado = Validador.validarLongitud(apellidoAdmin, 255, 'El apellido debe ser obligatorio', req, res, next);
    const correo = Validador.validarCorreo(correoAdmin, 'El correo debe ser un formato correo', req, res, next);
    const idUnico = Validador.validarNumeroEntero(id, 'El id debe ser un numero ', req, res, next)
    return { nombre_admin: nombreValidado, apellido_admin: apellidoValidado, correo_admin: correo, id_admin: idUnico };
}

// Middleware para validar el ID
function validarID(id, req, res, next) {
    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return next('route');
    }
    return id;
}

// Rutas
router.get('/', seguridad('admin'), obtenerTodos);
router.get('/:id', seguridad('admin'), obtenerPorId);
router.delete('/delete/:id', seguridad('admin'), eliminarPorId);
router.post('/save', seguridad('admin'), agregar);
router.put('/update', seguridad('admin'), actualizar);

// Funciones
async function obtenerTodos(req, res, next) {
    try {
        const items = await controlador.todos();
        respuestas.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
}

async function obtenerPorId(req, res, next) {
    try {
        const item = await controlador.uno(req.params.id);
        respuestas.success(req, res, item, 200);
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

async function agregar(req, res, next) {
    try {
        const validaciones = validarDatos(req.body.nombre_admin, req.body.apellido_admin, req.body.correo_admin, req.body.clave_admin, req, res, next);
        await controlador.agregar(validaciones);
        respuestas.success(req, res, 'Elemento insertado', 200);
    } catch (error) {
        next(error);
    }
}

async function actualizar(req, res, next) {
    try {
        const validaciones = validarFormatoActualizar(req.body.nombre_admin, req.body.apellido_admin, req.body.correo_admin, req.body.id_admin, req, res, next);
        await controlador.actualizar(validaciones);
        respuestas.success(req, res, 'Elemento actualizado', 200);
    } catch (error) {
        next(error);
    }
}

module.exports = router;
