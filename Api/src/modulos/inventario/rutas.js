const express = require('express');
const router = express.Router();
const respuestas = require('../../red/respuestas');
const controlador = require('./controlador');
const seguridad = require('../seguridad/seguridad');
const Validador = require('../recursos/validator');
const multerConfig = require('../recursos/upload');
const upload = multerConfig('inventarios');

//Rutas
