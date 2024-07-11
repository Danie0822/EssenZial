const nodemailer = require('nodemailer');
const config = require('../config');
const generarCorreoHTML = require('./html');

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
        from: 'w0lf3ryxd@gmail.com',
        to: destinatario,
        subject: 'Essenzial - Recuperación de Contraseña',
        text: `Hola,\n\nHas solicitado recuperar tu contraseña. Utiliza el siguiente código para restablecerla:\n\n${codigoRecuperacion}`,
        html: html
    };

    try {
        console.log('Attempting to send email...');
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error(`Error enviando correo: ${error.message}`);
    }
}

module.exports = {
    enviarCorreo
};
 