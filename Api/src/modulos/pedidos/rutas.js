const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const seguridad = require('../seguridad/seguridad');
const controlador = require('./index');
const { generarReportePDF } = require('../recursos/reportes');
//endpoint
router.get('/view/status/:estado/:id', seguridad('cliente'), estadosPedidos);
router.get('/procedure/details/:id_pedido', seguridad('cliente'), procedimientoDetalle);
router.get('/',seguridad('admin'), todos);
router.get('/:id',seguridad('admin'), uno);
router.get('/detalle/:id',seguridad('admin'), detallePedido);
router.delete('/delete/:id',seguridad('admin'), eliminarPorId);
router.put('/update',seguridad('admin'), actualizar);
router.get('/reporte/view/:nombre',seguridad('admin'), generarReporte);


// Middleware para validar el ID
function validarID(id, req, res, next) {
    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return next('route');
    }
    return id;
}
// Funciones
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