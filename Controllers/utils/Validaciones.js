// Objeto que contiene diversas funciones para validar diferentes tipos de datos
var validaciones = {
    // Función para validar si un valor es un número entero
    esNumeroEntero: function (valor) {
        return /^\d+$/.test(valor);
    },
    // Función para validar si un valor es un número decimal
    esNumeroDecimal: function (valor) {
        return /^\d+(\.\d+)?$/.test(valor);
    },
    // Función para validar si un valor contiene solo letras y números
    contieneSoloLetrasYNumeros: function (valor) {
        if (valor.trim() === "") {
            return false;
        }
        return /^[a-zA-Z0-9\s]*$/.test(valor);
    },
     // Función para validar si una contraseña tiene al menos 8 caracteres
    validarContra: function (contrasena) {
        return contrasena.length >= 8;
    },
    // Función para validar si una cadena es un correo electrónico válido
    validarCorreoElectronico: function (correo) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    },
    // Función para validar la longitud de una cadena, con un máximo especificado
    longitudMaxima: function (valor, maximo) {
        return valor.length >= 4 && valor.length <= maximo;
    },
      // Función para validar si un archivo de imagen tiene una extensión permitida
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
    // Función para validar si una cadena representa una fecha en formato "aaaa-mm-dd"
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
