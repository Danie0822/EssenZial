const auth = require('../../auth/index');

module.exports = function chequearAutj() {
    function middleware(req, res, next) {
        try {
            // Verificar y decodificar el token
            const decodedToken = auth.confirmarToken(req)
            // Si el token es válido, adjuntar la información del usuario decodificado al objeto de solicitud
            req.user = decodedToken;
            // Continuar con el siguiente middleware
            next();
        } catch (error) {
            // Manejar el error en caso de que el token no sea válido
            console.error('Error al verificar el token:', error.message);
            return res.status(401).json({ error: 'Token inválido' });
        }
    }

    return middleware;
};
