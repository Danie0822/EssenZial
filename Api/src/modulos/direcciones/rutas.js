// variables de depedencias 
const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');
const Validador = require('../recursos/validator');

// Middleware para validar el formato de los datos
function validarDatos(nombreDireccion, direccionCliente, telefonoCliente,codigo_postal, instrucciones_entrega, idCliente, req, res, next) {
    const nombreValidado = Validador.validarLongitud(nombreDireccion, 255, 'El nombre debe ser obligatorio', req, res, next);
    const dirrencioValidado = Validador.validarLongitud(direccionCliente, 255, 'la dirrecion debe ser obligatorio', req, res, next);
    const telefonoValidado = Validador.validarLongitud(telefonoCliente, 20, 'El telefono debe ser obligatorio', req, res, next);
    const codigoValidado = Validador.validarLongitud(codigo_postal, 5, 'El codigo debe ser obligatorio', req, res, next);
    const instruccionesValidado = Validador.validarLongitud(instrucciones_entrega, 100, 'las instruciones debe ser obligatorio', req, res, next);
    const id_cliente = Validador.validarNumeroEntero(idCliente, 'El id cliente debe ser obligatorio', req, res, next);
    return { nombre_direccion: nombreValidado, direccion_cliente: dirrencioValidado, telefono_cliente: telefonoValidado, codigo_postal: codigoValidado, instrucciones_entrega: instruccionesValidado, id_cliente: id_cliente};
}
// Middleware para validar el formato de los datos a actualizar
function validarFormatoActualizar(id,nombreDireccion, direccionCliente, telefonoCliente,codigo_postal, instrucciones_entrega, idCliente, req, res, next) {
    const nombreValidado = Validador.validarLongitud(nombreDireccion, 255, 'El nombre debe ser obligatorio', req, res, next);
    const dirrencioValidado = Validador.validarLongitud(direccionCliente, 255, 'la dirrecion debe ser obligatorio', req, res, next);
    const telefonoValidado = Validador.validarLongitud(telefonoCliente, 20, 'El telefono debe ser obligatorio', req, res, next);
    const codigoValidado = Validador.validarLongitud(codigo_postal, 5, 'El codigo debe ser obligatorio', req, res, next);
    const instruccionesValidado = Validador.validarLongitud(instrucciones_entrega, 100, 'las instruciones debe ser obligatorio', req, res, next);
    const id_cliente = Validador.validarNumeroEntero(idCliente, 'El id cliente debe ser obligatorio', req, res, next);
    const idUnico = Validador.validarNumeroEntero(id, 'El id dirrecion debe ser un numero ', req, res, next)
    return {id_direccion: idUnico,nombre_direccion: nombreValidado, direccion_cliente: dirrencioValidado, telefono_cliente: telefonoValidado, codigo_postal: codigoValidado, instrucciones_entrega: instruccionesValidado, id_cliente: id_cliente};
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
router.get('/:id', obtenerPorId);
router.get('/especifico/:id', seguridad('cliente'), obtenerDirrecion);
router.delete('/delete/:id', seguridad('cliente'), eliminarPorId);
router.post('/save', seguridad('cliente'),agregar);
router.put('/update', seguridad('cliente'), actualizar);

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

async function obtenerDirrecion(req, res, next) {
    try {
        const item = await controlador.unoDirrecion(req.params.id);
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
        console.log(error);
        next(error);
    }
}

async function agregar(req, res, next) {
    try {
        const validaciones = validarDatos(req.body.nombre_direccion, req.body.direccion_cliente, req.body.telefono_cliente, req.body.codigo_postal,req.body.instrucciones_entrega,req.body.id_cliente, req, res, next);
        await controlador.agregar(validaciones);
        respuestas.success(req, res, 'Elemento insertado', 200);
    } catch (error) {
        next(error);
    }
}

async function actualizar(req, res, next) {
    try {
        const validaciones = validarFormatoActualizar(req.body.id_direccion,req.body.nombre_direccion, req.body.direccion_cliente, req.body.telefono_cliente, req.body.codigo_postal,req.body.instrucciones_entrega,req.body.id_cliente, req, res, next);
        await controlador.actualizar(validaciones);
        respuestas.success(req, res, 'Elemento actualizado', 200);
    } catch (error) {
        next(error);
    }
}

module.exports = router;
