const db = require('../../DB/mysql');
const ctrl = require('./controlador');

//Inyecatmos la base de datos para que el controlador pueda usarlo
module.exports = ctrl(db);