// variables de dependecias 
const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');
const Validador = require('../recursos/validator');
const multerConfig = require('../recursos/upload');
const upload = multerConfig('categorias');
const { generarReportePDF } = require('../recursos/reportes');
// Middleware para validar el formato de los datos
function validarDatos(nombre, imagen, req, res, next) {
    const nombreValidado = Validador.validarLongitud(nombre, 255, 'El nombre debe ser obligatorio', req, res, next);
    const imagenValidada = Validador.validarCampo(imagen, 'La imagen es obligatoria', req, res, next);
    return { nombre_categoria: nombreValidado, imagen_categoria: imagenValidada };
}

function validarFormatoActualizar(imagen, nombre, req, res, next) {
    const nombreValidado = Validador.validarLongitud(nombre, 255, 'El nombre debe ser obligatorio', req, res, next);
    const imagenCategoria = (imagen && imagen.trim()) || null;
    return {
        nombre_categoria: nombreValidado,
        imagen_categoria: imagenCategoria
    };
}

// Middleware para validar el ID
function validarID(id, req, res, next) {
    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return next('route');
    }
    return id;
}

// Rutas
router.get('/', todos);
router.get('/:id', seguridad('admin'), uno);
router.delete('/delete/:id', seguridad('admin'), eliminar);
router.post('/save', seguridad('admin'), upload.single('imagen'), agregar);
router.put('/update', seguridad('admin'), upload.single('imagen'), actualizar);
router.get('/reporte/view/:nombre',seguridad('admin'), generarReporte);

// Funciones
async function todos(req, res, next) {
    try {
        const categoria = await controlador.todos();
        respuestas.success(req, res, categoria, 200);
    } catch (error) {
        next(error);
    }
}

async function generarReporte(req, res, next) {
    try {
        const items = await controlador.todos();
        const { nombre: username = 'Administrador' } = req.params;
        // Configuración del reporte
        const config = {
            items,
            username,
            titulo: 'Reporte de categorías',
            columnas: [
                { key: 'nombre_categoria', label: 'Nombre de categoría' }
            ],
            nombreArchivo: 'reportes_categoria.pdf'
        };
        await generarReportePDF(config, res); // Generar el reporte
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
        const id = validarID(req.params.id, req, res, next);
        await controlador.eliminar(id);
        respuestas.success(req, res, 'Categoria eliminada correctamente', 200);
    } catch (error) {
        next(error);
    }
}

async function agregar(req, res, next) {
    try {
        const datosValidados = validarDatos(req.body.nombre_categoria, req.file ? `uploads/categorias/${req.file.filename}` : null, req, res, next);
        await controlador.agregar(datosValidados.nombre_categoria, datosValidados.imagen_categoria);
        respuestas.success(req, res, 'Categoria agregada correctamente', 200);
    } catch (error) {
        next(error);
    }
}

async function actualizar(req, res, next) {
    try {
        const datosValidados = validarFormatoActualizar(req.file ? `uploads/categorias/${req.file.filename}` : null, req.body.nombre_categoria, req, res, next);
        const id = validarID(req.body.id_categoria, req, res, next);
        await controlador.actualizar(id, datosValidados);
        respuestas.success(req, res, 'Categoria actualizada correctamente', 200);
    } catch (error) {
        next(error);
    }
}

module.exports = router;
