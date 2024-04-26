const express = require('express'); 
const morgan = require('morgan');
const config = require('./config'); 
const categoria = require('./modulos/categorias/rutas');
const inventarios = require('./modulos/inventario/rutas');
const Login = require('./modulos/Login/rutas');
const Admin = require('./modulos/admin/rutas');
const marcas = require('./modulos/marcas/rutas');
const olores = require('./modulos/olores/rutas');
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
//prueba
//rutas 
app.use('/api/categorias', categoria); 
app.use('/api/inventarios', inventarios);
app.use('/api/login', Login); 
app.use('/api/admin', Admin)
app.use('/api/marcas', marcas)
app.use('/api/olores', olores)
app.use(error); 

module.exports = app; 