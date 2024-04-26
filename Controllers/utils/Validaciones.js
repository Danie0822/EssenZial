var validaciones = {
    esNumeroEntero: function (valor) {
        return /^\d+$/.test(valor);
    },

    esNumeroDecimal: function (valor) {
        return /^\d+(\.\d+)?$/.test(valor);
    },

    contieneSoloLetrasYNumeros: function(valor) {
        if (valor.trim() === "") {
            return false;
        }
        return /^[a-zA-Z0-9\s]*$/.test(valor);
    },

    validarCorreoElectronico: function (correo) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    },

    validacionNombres: function (valor) {
        // Verificar si el valor está vacío
        if (!valor || valor.trim() === '') {
            return false; // Valor vacío, devuelve false
        }
    
        // Expresión regular para verificar que solo contenga letras (mayúsculas o minúsculas)
        const letrasRegex = /^[A-Za-z]+$/;
    
        // Verificar si el valor solo contiene letras
        if (!letrasRegex.test(valor)) {
            return false; // No solo contiene letras, devuelve false
        }
    
        // Si pasa ambas validaciones, el valor es válido
        return true;
    },    

    longitudMaxima: function (valor, maximo) {
        return valor.length <= maximo;
    },
    validarImagen: function (imagen) {
        if (imagen.length === 0) {
            return false;
        }
        // Obtener el nombre del archivo de la imagen seleccionada
        var nombreArchivo = imagen.name;
        // Obtener la extensión del archivo
        var extension = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1).toLowerCase();
        // Lista de extensiones de archivo permitidas (formatos de imagen)
        var extensionesPermitidas = ["jpg", "jpeg", "png", "gif", "bmp"];
        // Validar que la extensión esté en la lista de extensiones permitidas
        if (!extensionesPermitidas.includes(extension)) {
            return false;
        }
        return true;
    }
};
