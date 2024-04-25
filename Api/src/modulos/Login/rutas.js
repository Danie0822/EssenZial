const express = require('express');
const respuestas = require('../../red/respuestas');
const router = express.Router();
const controlador = require('./index');

// Rutas
router.get('/admin', loginAdmin);
router.get('/cliente', loginCliente);

// Funciones
async function loginAdmin(req, res, next) {
    try {
        const { correo, clave } = req.query;
        const { usuario, token, error } = await controlador.loginAdmin(correo, clave);
        if (token) {
            const { id_admin, nombre_admin } = usuario;
            respuestas.success(req, res, { id_admin, nombre_admin, token }, 200);
        } else {
            respuestas.error(req, res, error, 401);
        }
    } catch (error) {
        next(error);
    }
}

async function loginCliente(req, res, next) {
    try {
        const { correo, clave } = req.query;
        const { usuario, token, error } = await controlador.loginCliente(correo, clave);

        if (token) {
            const { id_cliente, nombre_cliente } = usuario;
            respuestas.success(req, res, { id_cliente, nombre_cliente, token }, 200);
        } else {
            respuestas.error(req, res, error, 401);
        }
    } catch (error) {
        next(error);
    }
}

module.exports = router;
