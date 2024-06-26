const { enviarCorreo } = require('../../servicios/servicios');

async function enviar(req, next) {
    const { destinatario, codigoRecuperacion } = req.body;
    try {
        const resultado = await enviarCorreo({ destinatario, codigoRecuperacion });
        return resultado;
    } catch (error) {
        next(error); 
    }
}

module.exports = {
    enviar
};
