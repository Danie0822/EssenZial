const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');
const Validador = require('../recursos/validator');
const multerConfig = require('../recursos/upload');
const upload = multerConfig('productos');

// Middleware para validar el formato de los datos
function validarDatos(imagen, idInventario,req, res, next) {
    const imagenValidada = Validador.validarCampo(imagen, 'La imagen es obligatoria', req, res, next);
    const idInValidado = Validador.validarNumeroEntero(idInventario, 'Revisa si el ID ingresado es del formato corecto', req, res, next);
    return { ruta_imagen: imagenValidada, id_inventario: idInValidado };
}


function validarFormatoActualizar(imagen, idInventario,  req, res, next) {
    const idInValidado = Validador.validarNumeroEntero(idInventario, 'Revisa si el ID ingresado es del formato corecto', req, res, next);
    const imagenInvenatario = (imagen && imagen.trim()) || null;
    return {
        ruta_imagen: imagenInvenatario,
        id_inventario : idInValidado
    };
}


// Middleware para validar el ID
function validarID(id, req, res, next) {
    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return next('route');
    }
    return id;
}

//RUTAS
router.get('/', seguridad('admin'), todos);
router.get('/:id', seguridad('admin'), uno);
router.post('/save', seguridad('admin'), upload.single('imagen'), agregar);
router.put('/update', seguridad('admin'), upload.single('imagen'), actualizar);
router.delete('/delete/:id', seguridad('admin'), eliminar);

// Funciones
async function todos(req, res, next) {
    try {
        const categoria = await controlador.todos();
        respuestas.success(req, res, categoria, 200);
    } catch (error) {
        next(error);
    }
}

async function eliminar(req, res, next) {
    try {
        const id = validarID(req.params.id, req, res, next);
        await controlador.eliminar(id);
        respuestas.success(req, res, 'Imagen eliminada correctamente', 200);
    } catch (error) {
        next(error);
    }
}

async function agregar(req, res, next) {
    try {
        const datosValidados = validarDatos(req.body.id_inventario, req.file ? `uploads/productos/${req.file.filename}` : null, req, res, next);
        await controlador.agregar(datosValidados.id_inventario, datosValidados.ruta_imagen);
        respuestas.success(req, res, 'Imagenes agregadas correctamente', 200);
    } catch (error) {
        next(error);
    }
}


async function actualizar(req, res, next) {
    try {
        const datosValidados = validarFormatoActualizar(req.file ? `uploads/productos/${req.file.filename}` : null, req.body.id_inventario, req, res, next);
        const id = validarID(req.body.id_imagen, req, res, next);
        await controlador.actualizar(id, datosValidados);
        respuestas.success(req, res, 'Imagenes actualizadas correctamente', 200);
    } catch (error) {
        next(error);
    }
}


module.exports = router;