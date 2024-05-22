const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');
const Validador = require('../recursos/validator');

// Middleware para validar el formato de los datos
function validarDatos(calificacionProducto, comentarioProducto, fechaValoracion, estadoComentario, idDetallePedido, req, res, next) {
    const calificacionValidada = Validador.validarNumeroRango(calificacionProducto, 0, 5, 'La calificación debe estar entre 0 y 5', req, res, next);
    const comentarioValidado = Validador.validarLongitud(comentarioProducto, 250, 'El comentario debe ser obligatorio y no superar los 250 caracteres', req, res, next);
    const estadoValidado = Validador.validarBooleano(estadoComentario, 'El estado del comentario debe ser un valor booleano', req, res, next);
    const idDetallePedidoValidado = Validador.validarNumeroEntero(idDetallePedido, 'El id del detalle del pedido debe ser un número entero positivo', req, res, next);
    return {
        calificacion_producto: calificacionValidada,
        comentario_producto: comentarioValidado,
        estado_comentario: estadoValidado,
        id_detalle_pedido: idDetallePedidoValidado
    };
}

//Rutas 
router.get('/:id', seguridad('cliente'), valoracionesIn);
router.post('/save', seguridad('cliente'), Agregar);

async function valoracionesIn(req, res, next) {
    try {
        console.log(req.params.id);
        const valo = await controlador.valoraciones(req.params.id);
        respuestas.success(req, res, valo, 200);
    } catch (error) {
        next(error);
    }
}

async function Agregar(req, res, next) {
    try {
        const validaciones = validarDatos(req.body.calificacion_producto, req.body.comentario_producto, req.body.fecha_valoracion, req.body.estado_comentario,req.body.id_detalle_pedido, req, res, next);
        await controlador.insert(validaciones);
        respuestas.success(req, res, 'Elemento actualizado', 200);
    } catch (error) {
        next(error);
    }
}

module.exports = router;
