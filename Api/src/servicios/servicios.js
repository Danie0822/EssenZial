const nodemailer = require('nodemailer');
const config = require('../config');
const generarCorreoHTML =  require('./html');
// Crear y configurar el transportador de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.correo.user,
        pass: config.correo.pass
    }
});

// Función para enviar correos electrónicos
async function enviarCorreo({ destinatario, codigoRecuperacion }) {
    const html = generarCorreoHTML({ codigoRecuperacion });
    const mailOptions = {
        from: 'alessandromorales0822@gmail.com',
        to: destinatario,
        subject: 'Essenzial - Recuperación de Contraseña',
        text: `Hola,\n\nHas solicitado recuperar tu contraseña. Utiliza el siguiente código para restablecerla:\n\n${codigoRecuperacion}`,
        html: html
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        throw new Error(`Error enviando correo: ${error.message}`);
    }
}

module.exports = {
    enviarCorreo
};
