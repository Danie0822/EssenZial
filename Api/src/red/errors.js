const respuestas = require('./respuestas'); 
// Funcion por si pasa algun error se manda llamar esto 
function errors(err, req, res, next){
    console.error('error:', err);
    const mensaje = err.mensaje || 'Error interno'; 
    const status = err.statusCode || 500; 

    respuestas.error(req, res, mensaje, status); 
}

module.exports = errors; 