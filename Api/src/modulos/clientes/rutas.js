// variables de depedencias 
const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');
const Validador = require('../recursos/validator');

// Middleware para validar el formato de los datos
function validarDatos(nombreCliente, apellidoCLiente, correoCliente, claveCliente, telefonoCliente, estado, req, res, next) {
    const nombreValidado = Validador.validarLongitud(nombreCliente, 255, 'El nombre debe ser obligatorio', req, res, next);
    const apellidoValidado = Validador.validarLongitud(apellidoCLiente, 255, 'El apellido debe ser obligatorio', req, res, next);
    const telefono = Validador.validarLongitud(telefonoCliente, 255, 'El Telefono debe ser obligatorio', req, res, next);
    const correo = Validador.validarCorreo(correoCliente, 'El correo debe ser un formato correo', req, res, next);
    const contra = Validador.validarLongitud(claveCliente, 300, 'El clave debe ser obligatorio', req, res, next);
    const estadoCliente = Validador.validarBooleano(estado, 'El estado debe ser un formato valido', req, res, next)
    return { nombre_cliente: nombreValidado, apellido_cliente: apellidoValidado, correo_cliente: correo, clave_cliente: contra, telefono_cliente: telefono, estado_cliente: estadoCliente};
}
// Middleware para validar el formato de los datos a actualizar
function validarFormatoActualizar(id, estado, req, res, next) {
    const idUnico = Validador.validarNumeroEntero(id, 'El id debe ser un numero ', req, res, next)
    const estado_cliente = Validador.validarBooleano(estado, 'El estado debe ser un formato valido', req, res, next)
    return {id_cliente: idUnico, estado_cliente: estado_cliente };
}

// Middleware para validar el ID
function validarID(id, req, res, next) {
    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return next('route');
    }
    return id;
}  
function validarFormatoActualizarCliente(id,nombreCliente,apellidoCLiente,telefonoCliente,correoCliente, claveCliente,req, res, next) {
    const idUnico = Validador.validarNumeroEntero(id, 'El id debe ser un numero ', req, res, next)
    const nombreValidado = Validador.validarLongitud(nombreCliente, 255, 'El nombre debe ser obligatorio', req, res, next);
    const apellidoValidado = Validador.validarLongitud(apellidoCLiente, 255, 'El apellido debe ser obligatorio', req, res, next);
    const telefono = Validador.validarLongitud(telefonoCliente, 255, 'El Telefono debe ser obligatorio', req, res, next);
    const correo = Validador.validarCorreo(correoCliente, 'El correo debe ser un formato correo', req, res, next);
    const contra = Validador.validarLongitud(claveCliente, 300, 'El clave debe ser obligatorio', req, res, next);
    return {id_cliente: idUnico, nombre_cliente: nombreValidado, apellido_cliente: apellidoValidado,clave_cliente: contra, correo_cliente: correo,telefono_cliente: telefono };
} 
function validarFormatoActualizarClienteClave(correoCliente, claveCliente,req, res, next) {
    const correo = Validador.validarCorreo(correoCliente, 'El correo debe ser un formato correo', req, res, next);
    const contra = Validador.validarLongitud(claveCliente, 300, 'El clave debe ser obligatorio', req, res, next);
    return {clave_cliente: contra, correo_cliente: correo};

} 

// Rutas
router.get('/view/destacados', seguridad('cliente'), vistaTodos);
router.get('/', seguridad('admin'), obtenerTodos);
router.get('/:id', seguridad('cliente'), obtenerPorId);
router.delete('/delete/:id', seguridad('admin'), eliminarPorId);
router.post('/save', agregar);
router.put('/update', seguridad('admin'), actualizar);
router.put('/update/cliente', seguridad('cliente'), actualizarCliente);
router.put('/update/cliente/clave', actualizarClave);
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
        const validaciones = validarDatos(req.body.nombre_cliente, req.body.apellido_cliente, req.body.correo_cliente, req.body.clave_cliente,req.body.telefono_cliente,req.body.estado_cliente, req, res, next);
        await controlador.agregar(validaciones);
        respuestas.success(req, res, 'Elemento insertado', 200);
    } catch (error) {
        next(error);
    }
}

async function actualizar(req, res, next) {
    try {
        const validaciones = validarFormatoActualizar(req.body.id_cliente, req.body.estado_cliente, req, res, next);
        await controlador.actualizar(validaciones);
        respuestas.success(req, res, 'Elemento actualizado', 200);
    } catch (error) {
        next(error);
    }
}
async function actualizarCliente(req, res, next) {
    try {
        const validaciones = validarFormatoActualizarCliente(req.body.id_cliente, req.body.nombre_cliente, req.body.apellido_cliente, req.body.telefono_cliente, req.body.correo_cliente,req.body.clave_cliente, req, res, next);
        await controlador.actualizar(validaciones);
        respuestas.success(req, res, 'Elemento actualizado', 200);
    } catch (error) {
        next(error);
    }
}

async function actualizarClave(req, res, next) {
    try {
        const validaciones = validarFormatoActualizarClienteClave(req.body.correo_cliente,req.body.clave_cliente, req, res, next);
        await controlador.actualizarClave(validaciones);
        respuestas.success(req, res, 'Elemento actualizado', 200);
    } catch (error) {
        next(error);
    }
}

async function vistaTodos(req, res, next){
    try {
        const items = await controlador.todosVista();
        respuestas.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
}
module.exports = router;
