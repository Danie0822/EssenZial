// Formatos de Respuestas de error y exito
exports.success = function(req, res, mensaje = '', status = 200) {
    res.status(status).json({
        success: true,
        status: status,
        data: mensaje
    });
}

exports.error = function(req, res, mensaje, status) {
    status = (typeof status === 'undefined') ? 500 : status;
    mensaje = (typeof mensaje === 'undefined') ? 'Error interno del servidor' : mensaje;
    res.status(status).json({
        success: false,
        status: status,
        error:  mensaje
        
    });
};

