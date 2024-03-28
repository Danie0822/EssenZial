const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');
const multer = require('multer');
const upload = require('../recursos/upload');

// Validación de nombre y URL de imagen
function validarformato(imagen, nombre, req, res, next) {
    if (!imagen || imagen.trim().length === 0 || !nombre || nombre.trim().length === 0) {
        respuestas.error(req, res, 'Tanto el nombre como la imagen son obligatorios', 400);
        return next('route');
    }
    if (nombre.trim().length > 255) {
        respuestas.error(req, res, 'El nombre no puede tener más de 255 caracteres', 400);
        return next('route');
    }
    return {
        nombre_categoria: nombre.trim(),
        imagen_categoria: imagen.trim()

    };
}

function validarID(id, req, res, next) {
    if (!id || isNaN(id) || parseInt(id) <= 0) {
        respuestas.error(req, res, 'El Id debe ser un número entero mayor que cero', 400);
        return next('route');
    }

    return id;
}



// Rutas
router.get('/', seguridad('admin'), todos);
router.get('/:id', seguridad('admin'), uno);
router.delete('/delete/:id', seguridad('admin'), eliminar);
router.post('/save', seguridad('admin'), upload.single('imagen'), agregar);
router.put('/update', seguridad('admin'), upload.single('imagen'), actualizar);



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
        let filePath = null;
        if (req.file) {
            filePath = `uploads/${req.file.filename}`;
        }
        const datosValidados = validarformato(filePath, req.body.nombre_categoria, req, res, next);
        await controlador.agregar(datosValidados.nombre_categoria, datosValidados.imagen_categoria);
        respuestas.success(req, res, 'Categoria agregada correctamente', 200);
    } catch (error) {
        next(error);
    }
}
async function actualizar(req, res, next) {
    try {
        let filePath = null;
        if (req.file) {
            filePath = `uploads/${req.file.filename}`;
        }
        const datosValidados = validarformato(filePath, req.body.nombre_categoria, req, res, next);
        const id = validarID(req.body.id_categoria, req, res, next)
        await controlador.actualizar(id, datosValidados);
        respuestas.success(req, res, 'Cliente actualizado correctamente', 200);
    } catch (error) {
        next(error);
    }
}



module.exports = router;
