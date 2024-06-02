// Depedencias 
const express = require('express'); 
const morgan = require('morgan');
const config = require('./config'); 
const categoria = require('./modulos/categorias/rutas');
const inventarios = require('./modulos/inventario/rutas');
const Login = require('./modulos/login/rutas');
const admin = require('./modulos/admin/rutas');
const marcas = require('./modulos/marcas/rutas');
const pedidos = require('./modulos/pedidos/rutas');
const cliente = require('./modulos/clientes/rutas');
const olores = require('./modulos/olores/rutas');
const imagenes = require('./modulos/imagenes/rutas');
const dirreciones = require('./modulos/dirreciones/rutas');
const descuentos = require('./modulos/descuentos/rutas');
const valoraciones = require('./modulos/valoraciones/rutas');
const dashboard = require('./modulos/dashboard/rutas');
const valoracion = require('./modulos/valoracion/rutas');
const dashboardP = require('./modulos/dashboardpublica/rutas');
const charts = require('./modulos/charts/rutas'); 
const producto_publica = require ('./modulos/detalleproductopublica/rutas'); 
const carrito = require('./modulos/carrito/rutas');
const app = express(); 
const error = require('./red/errors'); 
const cors = require('cors');

//Middleware
app.use(morgan('dev')); 
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use('/uploads', express.static('uploads'));

//configuracion
app.set('port', config.app.port);
//rutas 
app.use('/api/categorias', categoria); 
app.use('/api/inventario', inventarios);
app.use('/api/login', Login); 
app.use('/api/admin', admin);
app.use('/api/imagenes', imagenes);
app.use('/api/cliente', cliente);
app.use('/api/marcas', marcas);
app.use('/api/olores', olores);
app.use('/api/pedidos', pedidos);
app.use('/api/descuentos', descuentos);
app.use('/api/valoraciones', valoraciones);
app.use('/api/ultimospedidos',dashboard);
app.use('/api/charts',charts);
app.use('/api/dashboard/public',dashboardP);
app.use('/api/dirreciones',dirreciones);
app.use('/api/public/valoraciones',valoracion);
app.use('/api/public/producto',producto_publica); 
app.use('/api/public/carrito', carrito); 
app.use(error); 

module.exports = app; 