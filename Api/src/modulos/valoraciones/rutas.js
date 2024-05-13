const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');
const Validador = require('../recursos/validator');


//Rutas 
router.get('/:id', seguridad('admin'), valoracionesIn);
router.put('/update', seguridad('admin'), actualizarEstado);
async function valoracionesIn(req, res, next){
    try{
        const valo = await controlador.valoraciones(req.params.id);
        respuestas.success(req, res, valo, 200);
    }catch(error){
        next(error);
    }
}

async function actualizarEstado(req, res, next) {
    try {
        await controlador.actualizar(req.body);
        respuestas.success(req, res, 'Elemento actualizado', 200);
    } catch (error) {
        next(error);
    }
}

module.exports = router;
