const auth = require('../../auth/index');

module.exports = function chequearAuth(tipoUsuario) {
    // Verificar y decodificar el token fuera del middleware
    const validarToken = (req, res, next) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ error: 'Token no proporcionado' });
            }
            const decodedToken = auth.verificarToken(token, tipoUsuario);
            req.user = decodedToken;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Token inválido' });
        }
    };

    // Verificar si el tipo de usuario coincide con el permitido para acceder a la ruta
    const verificarTipoUsuario = (req, res, next) => {
        if (req.user.userType !== tipoUsuario) {
            return res.status(403).json({ error: 'Acceso no autorizado' });
        }
        next();
    };

    return [validarToken, verificarTipoUsuario];
};
