const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');
const multer = require('multer');
const upload = require('../recursos/upload');

// Funciones
async function todos(req, res, next) {
    try {
        const categoria = await controlador.todos();
        respuestas.success(req, res, categoria, 200);
    } catch (error) {
        next(error);
    }
}

async function uno(req, res, next) {
    try {
        const categoria = await controlador.uno(req.params.id);
        respuestas.success(req, res, categoria, 200);
    } catch (error) {
        next(error);
    }
}

async function eliminar(req, res, next) {
    try {
        await controlador.eliminar(req.params.id);
        respuestas.success(req, res, 'Categoria eliminada correctamente', 200);
    } catch (error) {
        next(error);
    }
}

async function agregar(req, res, next) {
    try {
        const categoriaData = req.body;
        let filePath = null;
        if (req.file) {
            filePath = `uploads/${req.file.filename}`;
            categoriaData.imagen_categoria = filePath;
        }
        await controlador.agregar(categoriaData, filePath);
        respuestas.success(req, res, 'Categoria agregada correctamente', 200);
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
            clienteData.imagen_categoria = filePath;
        }
        console.log(clienteData);
        await controlador.actualizar(clienteData.id_categoria,clienteData);
        respuestas.success(req, res, 'Cliente actualizado correctamente', 200);
    } catch (error) {
        next(error);
    }
}

// Rutas
router.get('/', seguridad('admin'), todos);
router.get('/:id', seguridad('admin'), uno);
router.delete('/delete/:id', seguridad('admin'), eliminar);
router.post('/save', seguridad('admin'), upload.single('imagen'), agregar);
router.put('/update', seguridad('admin'), upload.single('imagen'), actualizar);

module.exports = router;
