class Validador {
    static validarCampo(valor, mensajeError) {
        if (!valor || valor.trim().length === 0) {
            throw new Error(mensajeError);
        }
        return valor.trim();
    }

    static validarLongitud(valor, longitudMaxima, mensajeError) {
        if (typeof valor !== 'string' || (valor && (valor.trim().length < 4 || valor.trim().length > longitudMaxima))) {
            throw new Error(mensajeError);
        }
        return valor.trim();
    }
    
    static validarCorreo(correo, mensajeError) {
        if (typeof correo !== 'string' || correo.trim().length < 5 || correo.trim().length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
            throw new Error(mensajeError);
        }
        return correo.trim();
    }

    static validarNumeroEntero(numero, mensajeError) {
        if (!Number.isInteger(numero = parseInt(numero)) || numero <= 0) {
            throw new Error(mensajeError);
        }
        return numero;
    }
}

module.exports = Validador;
