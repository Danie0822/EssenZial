const express = require('express'); 
const respuestas = require('../../red/respuestas');
const router = express.Router(); 
const controlador = require('./index'); 

// rutas
router.get('/login', login);


// Funciones

async function login(req, res, next) {
    try {
        const { usuario, clave } = req.query;
        const result = await controlador.login(usuario, clave);

        if (result.token) {
            respuestas.success(req, res, result.token, 200);
        } else {
            respuestas.error(req, res, result.error, 401);
        }
    } catch (error) {
        next(error);
    }
}


module.exports = router; 