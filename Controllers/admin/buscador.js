document.addEventListener("DOMContentLoaded", function () {
    const tablaBody = document.getElementById("tablaBody");
    const inputBusqueda = document.querySelector(".txt-buscar input");

    const filtrarCategorias = (texto) => {
        const filas = document.querySelectorAll("#tablaBody tr");
        filas.forEach(fila => {
            const nombreCategoria = fila.querySelector("td:first-child").textContent.toLowerCase();
            fila.style.display = nombreCategoria.includes(texto.toLowerCase()) ? "table-row" : "none";
        });
    };

    const restaurarVisibilidad = () => {
        filtrarCategorias("");
        inputBusqueda.value = "";
    };

    inputBusqueda.addEventListener("input", function (event) {
        filtrarCategorias(event.target.value);
    });

    document.querySelector(".buscar").addEventListener("click", restaurarVisibilidad);
});
