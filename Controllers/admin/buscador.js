document.addEventListener("DOMContentLoaded", function () {
    // Se obtiene una referencia al elemento <tbody>
    const tablaBody = document.getElementById("tablaBody");
    const inputBusqueda = document.querySelector(".txt-buscar input");
    // Función para filtrar las categorías según el texto de búsqueda
    const filtrarCategorias = (texto) => {
        const filas = document.querySelectorAll("#tablaBody tr");
        // Se itera sobre cada fila
        filas.forEach(fila => {
            const nombreCategoria = fila.querySelector("td:first-child").textContent.toLowerCase();
            fila.style.display = nombreCategoria.includes(texto.toLowerCase()) ? "table-row" : "none";
        });
    };
    // Función para restablecer la visibilidad de todas las filas
    const restaurarVisibilidad = () => {
        filtrarCategorias("");
        inputBusqueda.value = "";
    };
    // Se añade un event listener al evento "input"
    inputBusqueda.addEventListener("input", function (event) {
        filtrarCategorias(event.target.value);
    });

    document.querySelector(".buscar").addEventListener("click", restaurarVisibilidad);
});
