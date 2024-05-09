// Variables de depedencias 
const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');

// Rutas
router.get('/marcasVendidas', seguridad('admin'), marcasVendidas);
router.get('/perfumesVendidos', seguridad('admin'), perfumesVendidos);
router.get('/ventaMeses', seguridad('admin'), ventaMeses);

// Funciones
async function marcasVendidas(req, res, next) {
    try {
        const marcas = await controlador.marcasVendidas();
        respuestas.success(req, res, marcas, 200);
    } catch (error) {
        next(error);
    }
}
async function perfumesVendidos(req, res, next) {
    try {
        const perfumes = await controlador.perfumesVendidos();
        respuestas.success(req, res, perfumes, 200);
    } catch (error) {
        next(error);
    }
}
async function ventaMeses(req, res, next) {
    try {
        const ventas = await controlador.ventaMeses();
        respuestas.success(req, res, ventas, 200);
    } catch (error) {
        next(error);
    }
}

module.exports = router;