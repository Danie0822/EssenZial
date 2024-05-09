var validaciones = {
    esNumeroEntero: function (valor) {
        return /^\d+$/.test(valor);
    },

    esNumeroDecimal: function (valor) {
        return /^\d+(\.\d+)?$/.test(valor);
    },

    contieneSoloLetrasYNumeros: function (valor) {
        if (valor.trim() === "") {
            return false;
        }
        return /^[a-zA-Z0-9\s]*$/.test(valor);
    },
    validarContra: function (contrasena) {
        return contrasena.length >= 8;
    },
    validarCorreoElectronico: function (correo) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    },

    longitudMaxima: function (valor, maximo) {
        return valor.length >= 4 && valor.length <= maximo;
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
    },
    esFechaValida: function (fecha) {
        // Expresión regular para validar el formato "aaaa-mm-dd"
        const regexFecha = /^(\d{4})-(\d{2})-(\d{2})$/;

        // Validar el formato de la fecha
        if (!regexFecha.test(fecha)) {
            return false;
        }

        // Extraer los componentes de la fecha
        const [, anio, mes, dia] = fecha.match(regexFecha);

        // Crear un objeto de fecha
        const fechaObj = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia));

        // Verificar si la fecha es válida
        return (
            fechaObj.getFullYear() == parseInt(anio) &&
            fechaObj.getMonth() + 1 == parseInt(mes) &&
            fechaObj.getDate() == parseInt(dia)
        );
    }



};
