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
router.get('/topCategorias', seguridad('admin'), categorias);
router.get('/topOlores', seguridad('admin'), olores);

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
async function categorias(req, res, next) {
    try {
        const ventas = await controlador.topCategorias();
        respuestas.success(req, res, ventas, 200);
    } catch (error) {
        next(error);
    }
}
async function olores(req, res, next) {
    try {
        const ventas = await controlador.topOlores();
        respuestas.success(req, res, ventas, 200);
    } catch (error) {
        next(error);
    }
}

module.exports = router;