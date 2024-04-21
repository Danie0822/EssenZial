const db = require('../../DB/mysql');
const ctrl = require('./controlador');

//Inyectamos base de datos al controlador
module.exports = ctrl(db);