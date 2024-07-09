// variables de depedencias 
const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');
const Validador = require('../recursos/validator');
const PDFDocument = require('pdfkit'); // Asegúrate de que esta línea esté correcta
// Middleware para validar el formato de los datos
function validarDatos(nombreCliente, apellidoCLiente, correoCliente, claveCliente, telefonoCliente, estado, req, res, next) {
    const nombreValidado = Validador.validarLongitud(nombreCliente, 255, 'El nombre debe ser obligatorio', req, res, next);
    const apellidoValidado = Validador.validarLongitud(apellidoCLiente, 255, 'El apellido debe ser obligatorio', req, res, next);
    const telefono = Validador.validarLongitud(telefonoCliente, 255, 'El Telefono debe ser obligatorio', req, res, next);
    const correo = Validador.validarCorreo(correoCliente, 'El correo debe ser un formato correo', req, res, next);
    const contra = Validador.validarLongitud(claveCliente, 300, 'El clave debe ser obligatorio', req, res, next);
    const estadoCliente = Validador.validarBooleano(estado, 'El estado debe ser un formato valido', req, res, next)
    return { nombre_cliente: nombreValidado, apellido_cliente: apellidoValidado, correo_cliente: correo, clave_cliente: contra, telefono_cliente: telefono, estado_cliente: estadoCliente};
}
// Middleware para validar el formato de los datos a actualizar
function validarFormatoActualizar(id, estado, req, res, next) {
    const idUnico = Validador.validarNumeroEntero(id, 'El id debe ser un numero ', req, res, next)
    const estado_cliente = Validador.validarBooleano(estado, 'El estado debe ser un formato valido', req, res, next)
    return {id_cliente: idUnico, estado_cliente: estado_cliente };
}

// Middleware para validar el ID
function validarID(id, req, res, next) {
    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return next('route');
    }
    return id;
}  
function validarFormatoActualizarCliente(id,nombreCliente,apellidoCLiente,telefonoCliente,correoCliente, claveCliente,req, res, next) {
    const idUnico = Validador.validarNumeroEntero(id, 'El id debe ser un numero ', req, res, next)
    const nombreValidado = Validador.validarLongitud(nombreCliente, 255, 'El nombre debe ser obligatorio', req, res, next);
    const apellidoValidado = Validador.validarLongitud(apellidoCLiente, 255, 'El apellido debe ser obligatorio', req, res, next);
    const telefono = Validador.validarLongitud(telefonoCliente, 255, 'El Telefono debe ser obligatorio', req, res, next);
    const correo = Validador.validarCorreo(correoCliente, 'El correo debe ser un formato correo', req, res, next);
    const contra = Validador.validarLongitud(claveCliente, 300, 'El clave debe ser obligatorio', req, res, next);
    return {id_cliente: idUnico, nombre_cliente: nombreValidado, apellido_cliente: apellidoValidado,clave_cliente: contra, correo_cliente: correo,telefono_cliente: telefono };
} 

function validarFormatoActualizarClienteVa(id,nombreCliente,apellidoCLiente,telefonoCliente,correoCliente,req, res, next) {
    const idUnico = Validador.validarNumeroEntero(id, 'El id debe ser un numero ', req, res, next)
    const nombreValidado = Validador.validarLongitud(nombreCliente, 255, 'El nombre debe ser obligatorio', req, res, next);
    const apellidoValidado = Validador.validarLongitud(apellidoCLiente, 255, 'El apellido debe ser obligatorio', req, res, next);
    const telefono = Validador.validarLongitud(telefonoCliente, 255, 'El Telefono debe ser obligatorio', req, res, next);
    const correo = Validador.validarCorreo(correoCliente, 'El correo debe ser un formato correo', req, res, next);
    return {id_cliente: idUnico, nombre_cliente: nombreValidado, apellido_cliente: apellidoValidado, correo_cliente: correo,telefono_cliente: telefono };
} 

function validarFormatoActualizarClienteClave(correoCliente, claveCliente,req, res, next) {
    const correo = Validador.validarCorreo(correoCliente, 'El correo debe ser un formato correo', req, res, next);
    const contra = Validador.validarLongitud(claveCliente, 300, 'El clave debe ser obligatorio', req, res, next);
    return {clave_cliente: contra, correo_cliente: correo};

} 

// Rutas
router.get('/view/destacados', seguridad('cliente'), vistaTodos);
router.get('/', seguridad('admin'), obtenerTodos);
router.get('/:id', seguridad('cliente'), obtenerPorId);
router.delete('/delete/:id', seguridad('admin'), eliminarPorId);
router.post('/save', agregar);
router.put('/update', seguridad('admin'), actualizar);
router.put('/update/cliente', seguridad('cliente'), actualizarCliente);
router.put('/update/cliente/clave', actualizarClave);
router.put('/update/vali/cliente', seguridad('cliente'), actualizarVa);
router.get('/reporte/view', generarReportePDF);

// Funciones

async function generarReportePDF(req, res, next) {
    try {
        const items = await controlador.todos();

        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        let filename = `reporte_clientes_${new Date().toISOString()}.pdf`;
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        // Encabezado
        doc
            .fillColor('#444444')
            .fontSize(20)
            .text('Reporte de Clientes', { align: 'center' })
            .fontSize(10)
            .text(`Fecha: ${new Date().toLocaleDateString()}`, { align: 'right' });

        // Linea de separación
        doc
            .moveTo(50, 80)
            .lineTo(550, 80)
            .stroke();

        // Estilo de tabla
        const tableTop = 100;
        const itemHeight = 30;

        // Columnas de la tabla
        doc
            .fontSize(10)
            .text('ID', 50, tableTop)
            .text('Nombre', 100, tableTop)
            .text('Apellido', 200, tableTop)
            .text('Correo', 300, tableTop)
            .text('Teléfono', 400, tableTop)
            .text('Estado', 500, tableTop);

        // Datos de la tabla
        let i = 0;
        items.forEach(item => {
            const y = tableTop + 25 + (i * itemHeight);
            doc
                .fontSize(10)
                .text(item.id_cliente, 50, y)
                .text(item.nombre_cliente, 100, y)
                .text(item.apellido_cliente, 200, y)
                .text(item.correo_cliente, 300, y)
                .text(item.telefono_cliente, 400, y)
                .text(item.estado_cliente ? 'Activo' : 'Inactivo', 500, y);
            i++;
        });

        // Pie de página
        doc
            .moveTo(50, doc.page.height - 50)
            .lineTo(doc.page.width - 50, doc.page.height - 50)
            .stroke()
            .fontSize(10)
            .text('Reporte generado automáticamente', 50, doc.page.height - 40, { align: 'center', width: doc.page.width - 100 });

        // Finalizar y enviar el PDF
        doc.pipe(res);
        doc.end();
    } catch (error) {
        next(error);
    }
}
async function obtenerTodos(req, res, next) {
    try {
        const items = await controlador.todos();
        respuestas.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
}

async function obtenerPorId(req, res, next) {
    try {
        const item = await controlador.uno(req.params.id);
        respuestas.success(req, res, item, 200);
    } catch (error) {
        next(error);
    }
}

async function eliminarPorId(req, res, next) {
    try {
        const id = validarID(req.params.id, req, res, next);
        await controlador.eliminar(id);
        respuestas.success(req, res, 'Elemento eliminado', 200);
    } catch (error) {
        next(error);
    }
}

async function agregar(req, res, next) {
    try {
        const validaciones = validarDatos(req.body.nombre_cliente, req.body.apellido_cliente, req.body.correo_cliente, req.body.clave_cliente,req.body.telefono_cliente,req.body.estado_cliente, req, res, next);
        await controlador.agregar(validaciones);
        respuestas.success(req, res, 'Elemento insertado', 200);
    } catch (error) {
        next(error);
    }
}

async function actualizar(req, res, next) {
    try {
        const validaciones = validarFormatoActualizar(req.body.id_cliente, req.body.estado_cliente, req, res, next);
        await controlador.actualizar(validaciones);
        respuestas.success(req, res, 'Elemento actualizado', 200);
    } catch (error) {
        next(error);
    }
}
async function actualizarCliente(req, res, next) {
    try {
        const validaciones = validarFormatoActualizarCliente(req.body.id_cliente, req.body.nombre_cliente, req.body.apellido_cliente, req.body.telefono_cliente, req.body.correo_cliente,req.body.clave_cliente, req, res, next);
        await controlador.actualizar(validaciones);
        respuestas.success(req, res, 'Elemento actualizado', 200);
    } catch (error) {
        next(error);
    }
}

async function actualizarClave(req, res, next) {
    try {
        const validaciones = validarFormatoActualizarClienteClave(req.body.correo_cliente,req.body.clave_cliente, req, res, next);
        await controlador.actualizarClave(validaciones);
        respuestas.success(req, res, 'Elemento actualizado', 200);
    } catch (error) {
        next(error);
    }
}

async function actualizarVa(req, res, next) {
    try {
        const validaciones = validarFormatoActualizarClienteVa(req.body.id_cliente, req.body.nombre_cliente, req.body.apellido_cliente, req.body.telefono_cliente, req.body.correo_cliente, req, res, next);
        await controlador.actualizar(validaciones);
        respuestas.success(req, res, 'Elemento actualizado', 200);
    } catch (error) {
        next(error);
    }
}
async function vistaTodos(req, res, next){
    try {
        const items = await controlador.todosVista();
        respuestas.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
}
module.exports = router;
