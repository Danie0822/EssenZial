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
const descuentos = require('./modulos/descuentos/rutas');
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
app.use(error); 

module.exports = app; 