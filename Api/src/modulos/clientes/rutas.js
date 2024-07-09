// variables de depedencias 
const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const seguridad = require('../seguridad/seguridad');
const Validador = require('../recursos/validator');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
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
        const username = req.user && req.user.nombre ? req.user.nombre : 'Administrador';

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([612, 792]); // Tamaño carta en puntos (8.5 x 11 pulgadas)

        // Configuración de márgenes y dimensiones
        const margin = 42.5; // 1.5 cm ~ 42.5 puntos
        const contentWidth = page.getWidth() - 2 * margin;
        const contentHeight = page.getHeight() - 2 * margin;

        // Encabezado y Pie de página
        const headerHeight = 50;
        const footerHeight = 50;

        // Cargar logo de la empresa
        const logoPath = path.resolve(__dirname, '../../../uploads/logo/logo.jpeg'); // Ruta del logo
        let logoImage;
        try {
            const logoBytes = fs.readFileSync(logoPath);
            logoImage = await pdfDoc.embedJpg(logoBytes);
        } catch (error) {
            console.error('Error al cargar el logo:', error.message);
            return res.status(500).send('Error al cargar el logo.');
        }
        const logoDims = logoImage.scale(0.1);

        // Dibujar logo en la esquina superior derecha
        page.drawImage(logoImage, {
            x: page.getWidth() - margin - logoDims.width,
            y: page.getHeight() - margin - logoDims.height,
            width: logoDims.width,
            height: logoDims.height,
        });

        // Fecha y hora del sistema
        const now = new Date();
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString();

        // Dibujar encabezado
        page.drawText(`Fecha: ${formattedDate} ${formattedTime}`, {
            x: margin,
            y: page.getHeight() - margin - 20,
            size: 12,
        });

        page.drawText(`Usuario: ${username}`, {
            x: margin,
            y: page.getHeight() - margin - 40,
            size: 12,
        });

        // Título centrado
        page.drawText('Reporte de Clientes', {
            x: (page.getWidth() - 200) / 2,
            y: page.getHeight() - margin - headerHeight - 20,
            size: 20,
            color: rgb(0, 0, 0),
        });

        // Configuración de fuente
        const fontSize = 10;
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Dibujar la tabla
        const tableTop = page.getHeight() - margin - headerHeight - 60;
        let y = tableTop;
        const rowHeight = 20;
        const colWidths = [30, 100, 100, 150, 100, 50];

        // Dibujar encabezado de la tabla con fondo azul claro
        page.drawRectangle({
            x: margin,
            y: y - rowHeight,
            width: contentWidth,
            height: rowHeight,
            color: rgb(0.8, 0.9, 1),
        });

        const headers = ['ID', 'Nombre', 'Apellido', 'Correo', 'Teléfono', 'Estado'];
        headers.forEach((header, i) => {
            page.drawText(header, {
                x: margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
                y: y - 15,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
            });
        });

        y -= rowHeight;

        // Dibujar datos de la tabla
        items.forEach((item, index) => {
            const bgColor = index % 2 === 0 ? rgb(1, 1, 1) : rgb(0.95, 0.95, 0.95);
            page.drawRectangle({
                x: margin,
                y: y - rowHeight,
                width: contentWidth,
                height: rowHeight,
                color: bgColor,
            });

            const row = [
                item.id_cliente.toString(),
                item.nombre_cliente,
                item.apellido_cliente,
                item.correo_cliente,
                item.telefono_cliente,
                item.estado_cliente ? 'Activo' : 'Inactivo'
            ];

            row.forEach((text, i) => {
                page.drawText(text, {
                    x: margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
                    y: y - 15,
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0),
                });
            });

            y -= rowHeight;
        });

        // Dibujar pie de página con fondo azul
        const footerY = margin - footerHeight;
        page.drawRectangle({
            x: 0,
            y: footerY,
            width: page.getWidth(),
            height: footerHeight,
            color: rgb(0.8, 0.9, 1),
        });

        // Número de página
        const numberOfPages = pdfDoc.getPageCount();
        for (let i = 0; i < numberOfPages; i++) {
            const currentPage = pdfDoc.getPage(i);
            currentPage.drawText(`Página ${i + 1} de ${numberOfPages}`, {
                x: (page.getWidth() / 2) - 20,
                y: footerY + 15,
                size: 12,
                font,
                color: rgb(0, 0, 0),
            });
        }

        const pdfBytes = await pdfDoc.save();

        res.setHeader('Content-disposition', 'attachment; filename=reporte_clientes.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(Buffer.from(pdfBytes));
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
