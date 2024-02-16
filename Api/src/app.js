const express = require('express'); 
const morgan = require('morgan');
const config = require('./config'); 
const clientes = require('./modulos/clientes/rutas');
const usuario = require('./modulos/usuarios/rutas');
const Login = require('./modulos/Login/rutas');
const Admin = require('./modulos/admin/rutas');
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
app.use('/api/clientes', clientes); 
app.use('/api/usuarios', usuario); 
app.use('/Login', Login); 
app.use('/api/admin', Admin)
app.use(error); 

module.exports = app; 