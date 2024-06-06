const obtenerElemento = (id) => document.getElementById(id);
const abrirModal = (modal) => modal.show();
const cerrarModal = (modal) => modal.hide();

const obtenerClientes = async () => {
    try {
        const { success, data } = await fetchData('/cliente/view/destacados/');
        const container = document.querySelector('.row.justify-content-center');
        container.innerHTML = ''; // Limpiar cualquier contenido previo

        if (success) {
            data.forEach(({ nombre_cliente, apellido_cliente }) => {
                const tarjeta = document.createElement('div');
                tarjeta.className = 'card';
                tarjeta.style.width = '18rem';

                tarjeta.innerHTML = `
                    <img src="../../resources/img/userimagen.png" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-text">${nombre_cliente} ${apellido_cliente}</h5>
                    </div>
                `;

                container.appendChild(tarjeta);
            });
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    obtenerClientes();
});
