const obtenerElemento = (id) => document.getElementById(id);

const obtenerUltimosProductos = async () => {
    try {
        const { success, data } = await fetchData("/dashboard/public");
        const recienAgregados = document.getElementById("productos");

        if (success) {
            recienAgregados.innerHTML = ""; // Limpiar contenedor antes de agregar nuevas tarjetas

            data.forEach(({ nombre_producto, imagen_producto }) => {
                const recienAgregadosCard = `
                
                <div class="card m-2" style="width: 18rem;">
                <img src="${imagen}${imagen_producto}" class="card-img-top" alt="...">
                <div class="card-body">
                    <p class="card-text" style="color: black;">${nombre_producto}</p>
                </div>
            </div>
            
                `;
                recienAgregados.innerHTML += recienAgregadosCard;
            });
            // Inicializar Slick después de agregar los productos
            $('.productos').slick({
                dots: false,
                infinite: false,
                speed: 600,
                slidesToShow: 4,
                slidesToScroll: 2,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1,
                            infinite: false,
                            dots: false
                        }
                    },
                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });
            $('.one-time').slick({
                dots: false,
                infinite: true,
                speed: 300,
                slidesToShow: 1,
                adaptiveHeight: true
            });
        } else {
            manejarError("No se pudieron obtener los últimos pedidos.");; // Proporcionar mensaje de error
        }
    } catch (error) {
        console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
        manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
    }
};
document.addEventListener("DOMContentLoaded", function () {
    // Obtener cuando recarga pagina 
    obtenerUltimosProductos();
});