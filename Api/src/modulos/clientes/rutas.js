const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');
const multer = require('multer');
const upload = require('./upload');

// Funciones
async function todos(req, res, next) {
    try {
        const clientes = await controlador.todos();
        respuestas.success(req, res, clientes, 200);
    } catch (error) {
        next(error);
    }
}

async function uno(req, res, next) {
    try {
        const cliente = await controlador.uno(req.params.id);
        respuestas.success(req, res, cliente, 200);
    } catch (error) {
        next(error);
    }
}

async function eliminar(req, res, next) {
    try {
        await controlador.eliminar(req.params.id);
        respuestas.success(req, res, 'Cliente eliminado correctamente', 200);
    } catch (error) {
        next(error);
    }
}

async function agregar(req, res, next) {
    try {
        const clienteData = req.body;
        let filePath = null;
        if (req.file) {
            filePath = `uploads/${req.file.filename}`; // Concatena 'uploads/' con el nombre del archivo
            clienteData.ruta_imagen = filePath;
        }
        await controlador.agregar(clienteData, filePath);
        respuestas.success(req, res, 'Cliente agregado correctamente', 200);
    } catch (error) {
        next(error);
    }
}



async function actualizar(req, res, next) {
    try {
        const clienteData = req.body;
        let filePath = null;
        if (req.file) {
            filePath = `uploads/${req.file.filename}`; // Concatena 'uploads/' con el nombre del archivo
            clienteData.ruta_imagen = filePath;
        }
        await controlador.actualizar(clienteData.id,clienteData);
        respuestas.success(req, res, 'Cliente actualizado correctamente', 200);
    } catch (error) {
        next(error);
    }
}

// Rutas
router.get('/', seguridad(), todos);
router.get('/:id', seguridad(), uno);
router.delete('/delete/:id', seguridad(), eliminar);
router.post('/save', upload.single('imagen'), agregar); // Usamos multer con un solo archivo y el campo 'imagen'
router.put('/update', seguridad(), upload.single('imagen'), actualizar); // Usamos multer con un solo archivo y el campo 'imagen'

module.exports = router;
