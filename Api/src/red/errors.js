const respuestas = require('./respuestas'); 

function errors(err, req, res, next){
    console.error('error:', err);
    const mensaje = err.mensaje || 'Error interno'; 
    const status = err.statusCode || 500; 

    respuestas.error(req, res, mensaje, status); 
}

module.exports = errors; 