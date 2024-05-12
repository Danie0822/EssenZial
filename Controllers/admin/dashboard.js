const obtenerElemento = (id) => document.getElementById(id);
// Función para obtener datos de pedidos y mostrarlos en tarjetas

// Definir función para manejar errores
function manejarError(mensaje) {
    console.error("Error:", mensaje);
    // Aquí puedes implementar lógica adicional para manejaar el error, como mostrar un mensaje al usuario
  }
const mostrarUltimosPedidos = async () => {
    try {
        const { success, data } = await fetchData("/ultimospedidos/");
        const pedidosContainer = document.getElementById("ultimP");

        if (success) {
            pedidosContainer.innerHTML = ""; // Limpiar contenedor antes de agregar nuevas tarjetas
            
            data.forEach(({ fecha, nombre_producto, imagen_producto, cantidad }) => {
                const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
                const pedidoCard = `
                <div class="align-items-center pedidos">
                <div class="row">
                    <div class="col-4">
                        <p>${fechaFormateada}</p>
                    </div>
                    <div class="col-4">
                        <p>${nombre_producto}</p>
                    </div>
                    <div class="col-2"><img src="${imagen}${imagen_producto}" class="imagen" width="50px"
                            height="50px" alt="" srcset=""></div>
                    <div class="col-1 cantidad">${cantidad}</div>
                </div>
            </div>
                `;
                pedidosContainer.innerHTML += pedidoCard;
            });
        } else {
            manejarError("No se pudieron obtener los últimos pedidos.");; // Proporcionar mensaje de error
        }
    } catch (error) {
        console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
        manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
    }
};

const mostrarUltimasOfertas = async () => {
    try {
        const { success, data } = await fetchData("/ultimospedidos/ofertas/");
        const pedidosContainer = document.getElementById("ofertas");

        if (success) {
            pedidosContainer.innerHTML = ""; // Limpiar contenedor antes de agregar nuevas tarjetas
            
            data.forEach(({ descuento, fecha_inicio_descuento, fecha_fin_descuento,descripcion_descuento }) => {
                console.log(descuento);
                const fechaFormateada1 = new Date(fecha_inicio_descuento).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
                const fechaFormateada2 = new Date(fecha_fin_descuento).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
                const pedidoCard = `
                <div class="align-items-center pedidos">
                <div class="row">
                    <div class="col-2">
                        <p>${descuento}</p>
                    </div>
                    <div class="col-3">
                        <p>${fechaFormateada1}</p>
                    </div>
                    <div class="col-3">
                        <p>${fechaFormateada2}</p>
                    </div>
                    <div class="col-4">
                        <p>${descripcion_descuento}</p>
                    </div>
                </div>
            </div>
                `;
                pedidosContainer.innerHTML += pedidoCard;
            });
        } else {
            manejarError("No se pudieron obtener las ultimas ofertas."); // Proporcionar mensaje de error
        }
    } catch (error) {
        console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
        manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
    }
};
const llamarProcesos = async () => {
    await mostrarUltimosPedidos();
    await mostrarUltimasOfertas();
    await mostrarUltimosVedidas();
    await mostrarPerfumesMasVendidos();
    await mostrarVentas();
} 
// Evento al cargar el DOM para obtener y mostrar los últimos pedidos
document.addEventListener("DOMContentLoaded", function () {
    // Obtener cuando recarga pagina 
    llamarProcesos();
});