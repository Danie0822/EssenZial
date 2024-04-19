const auth = require('../../auth/index');

module.exports = function chequearAuth(tipoUsuario) {
    return function middleware(req, res, next) {
        try {
            // Verificar y decodificar el token
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            const decodedToken = auth.verificarToken(token, tipoUsuario);

            // Adjuntar la información del usuario decodificado al objeto de solicitud
            req.user = decodedToken;

            // Verificar si el tipo de usuario coincide con el permitido para acceder a la ruta
            if (decodedToken.userType !== tipoUsuario) {
                return res.status(403).json({ error: 'Acceso no autorizado' });
            }

            // Continuar con el siguiente middleware
            next();
        } catch (error) {
            // Manejar el error en caso de que el token no sea válido
            console.error('Error al verificar el token:', error.message);
            return res.status(401).json({ error: 'Token inválido' });
        }
    };
};
