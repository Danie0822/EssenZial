document.addEventListener("DOMContentLoaded", function () {
    const categoriaTableBody = document.getElementById("categoriaTableBody");
    const inputBusqueda = document.querySelector(".txt-buscar input");

    const filtrarCategorias = (texto) => {
        const categorias = document.querySelectorAll("#categoriaTableBody tr");
        categorias.forEach(categoria => {
            const nombreCategoria = categoria.querySelector("td:first-child").textContent.toLowerCase();
            categoria.style.display = nombreCategoria.includes(texto.toLowerCase()) ? "table-row" : "none";
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

    inputBusqueda.addEventListener("keyup", function (event) {
        if (event.keyCode === 27) {
            restaurarVisibilidad();
        }
    });
});
