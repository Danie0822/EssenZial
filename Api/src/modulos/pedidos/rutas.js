const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const seguridad = require('../seguridad/seguridad');
const controlador = require('./index');
const { generarReportePDF } = require('../recursos/reportes');
const { generarFacturaPDF } = require('../recursos/factura');
//endpoint
router.get('/view/status/:estado/:id', seguridad('cliente'), estadosPedidos);
router.get('/procedure/details/:id_pedido', seguridad('cliente'), procedimientoDetalle);
router.get('/',seguridad('admin'), todos);
router.get('/:id',seguridad('admin'), uno);
router.get('/detalle/:id',seguridad('admin'), detallePedido);
router.delete('/delete/:id',seguridad('admin'), eliminarPorId);
router.put('/update',seguridad('admin'), actualizar);
router.get('/reporte/view/:nombre',seguridad('admin'), generarReporte);
router.get('/reporte/factura/:id_pedido/:nombre', seguridad('cliente'), generarFactura);


// Middleware para validar el ID
function validarID(id, req, res, next) {
    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return next('route');
    }
    return id;
}
// Funciones
async function generarFactura(req, res, next) {
    try {
        const { id_pedido, nombre } = req.params;
        let result = await controlador.procedimientoDetalle(id_pedido);

        if (!result || !Array.isArray(result[0])) {
            console.log('Detalles del pedido no encontrados o en formato incorrecto.');
            return res.status(404).send('No se encontraron detalles del pedido.');
        }

        let items = result[0];

        if (items.length === 0) {
            console.log('Detalles del pedido vacíos.');
            return res.status(404).send('No se encontraron detalles del pedido.');
        }

        const username = nombre || 'Cliente';
        let fecha = null; // Array para almacenar todas las fechas
        let total = 0; // Inicializar el total

        // Recorrer los items para acumular fechas y total
        items.forEach(item => {
            fecha = new Date(item.fecha_pedido).toLocaleDateString('es-ES');
            total += item.total_pago; // Acumular el total_pago de cada item
        });

        // Configuración del reporte
        const config = {
            items,
            username,
            fecha,
            total, // Usar el total acumulado
            titulo: 'Factura de pedidos',
            columnas: [
                { key: 'nombre_inventario', label: 'Nombre producto' },
                { key: 'precio_inventario', label: 'Precio' },
                { key: 'cantidad_producto', label: 'Cantidad' },
            ],
            nombreArchivo: 'factura_pedido'
        };

        await generarFacturaPDF(config, res);
    } catch (error) {
        console.log(error);
        next(error);
    }
}







async function generarReporte(req, res, next) {
    try {
        let items = await controlador.todosCliente();
        const { nombre: username = 'Administrador' } = req.params;
        // Configuración del reporte
        const config = {
            items,
            username,
            titulo: 'Reporte de Pedidos',
            columnas: [
                { key: 'nombre_completo_cliente', label: 'Nombre del Cliente' },
                { key: 'fecha_pedido', label: 'Fecha' },
                { key: 'estado_pedido', label: 'Estado del Pedido' },
                { key: 'estado_pedido', label: 'Estado del Carrito' }
            ],
            nombreArchivo: 'reporte_pedidos'
        };
        await generarReportePDF(config, res); // Generar el reporte
    } catch (error) {
        next(error);
    }
}
async function todos(req, res, next) {
    try {
        const pedidos = await controlador.todos();
        respuestas.success(req, res, pedidos, 200);
    } catch (error) {
        next(error);
    }
}

async function uno(req, res, next) {
    try {
        const pedidos = await controlador.uno(req.params.id);
        respuestas.success(req, res, pedidos, 200);
    } catch (error) {
        next(error);
    }
}

async function detallePedido(req, res, next) {
    try {
        const pedidos = await controlador.detallePedido(req.params.id);
        respuestas.success(req, res, pedidos, 200);
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

async function actualizar(req, res, next) {
    try {
        await controlador.actualizar(req.body);
        respuestas.success(req, res, 'Elemento actualizado', 200);
    } catch (error) {
        next(error);
    }
}

async function estadosPedidos(req, res, next) {
    try {
        const { estado, id } = req.params;
        const pedidos = await controlador.estadoPedido(estado, id);
        respuestas.success(req, res, pedidos, 200);
    } catch (error) {
        next(error);
    }
}

async function procedimientoDetalle(req, res, next){
    try{
        const { id_pedido } = req.params;
        const detalle_pedidos = await controlador.procedimientoDetalle(id_pedido);
        respuestas.success(req, res, detalle_pedidos, 200);

    }catch(error){
        next(error);
    }
}


module.exports = router;