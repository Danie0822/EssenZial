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
router.get('/:id', seguridad('admin'), uno); //query para traer imagenes solo por id inventario
router.get('/view/:id', seguridad('admin'), unoId);
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

async function uno(req, res, next) {
    try {
        const imagen = await controlador.uno(req.params.id);
        respuestas.success(req, res, imagen, 200);
    } catch (error) {
        next(error);
    }
}
async function unoId(req, res, next){
    try {
        const imagen = await controlador.obtenerRegistroPorId(req.params.id_inventario);
        if (imagen) {
            respuestas.success(req, res, imagen, 200);
        } else {
            respuestas.error(req, res, "No se encontró el registro", 404);
        }
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
        // Verificar si se ha subido un archivo
        if (!req.file) {
            throw new Error('No se ha subido ninguna imagen.');
        }

        const filePath = `uploads/productos/${req.file.filename}`;
        const id_inventario = req.body.id_inventario;

        // Agregar la imagen a la base de datos
        await controlador.agregar(filePath, id_inventario);

        // Enviar respuesta al cliente
        respuestas.success(req, res, 'Imagen agregada correctamente', 200);
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