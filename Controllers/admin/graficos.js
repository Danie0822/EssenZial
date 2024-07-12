const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2');
const ctx3 = document.getElementById('myChart3');
const ctx4 = document.getElementById('myChart4');
const ctx5 = document.getElementById('myChart5');
// Definir función para manejar errores
function manejarError(mensaje) {
  console.error("Error:", mensaje);
}

// Función para mostrar las ultimas marcas mas vendidas en la chart 
const mostrarUltimosVedidas = async () => {
  try {
      const { success, data } = await fetchData("/charts/marcasVendidas/");
      if (success) {
          const labels = [];
          const porcentajes = [];
          data.forEach(({ nombre_marca, total_ventas }) => {
              labels.push(nombre_marca);
              porcentajes.push(total_ventas);
          });
          // Actualizar el gráfico con los nuevos datos
          myChart.data.labels = labels;
          myChart.data.datasets[0].data = porcentajes;
          myChart.update();
      } else {
          manejarError("No se pudieron obtener los últimos pedidos."); // Proporcionar mensaje de error
      }
  } catch (error) {
      console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
      manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
  }
};
// Función para mostrar los perfumes mas vendidos en la chart 
const mostrarPerfumesMasVendidos = async () => {
  try {
      const { success, data } = await fetchData("/charts/perfumesVendidos/");
      if (success) {
          const labels = [];
          const ventas = [];
          data.forEach(({ nombre_producto, total_ventas }) => {
              labels.push(nombre_producto);
              ventas.push(total_ventas);
          });
          // Actualizar el gráfico con los nuevos datos
          myChart2.data.labels = labels;
          myChart2.data.datasets[0].data = ventas;
          myChart2.update();
      } else {
          manejarError("No se pudieron obtener los últimos pedidos."); // Proporcionar mensaje de error
      }
  } catch (error) {
      console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
      manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
  }
};
// Función para mostrar las ventas de cada mes
const mostrarVentas = async () => {
  try {
      const { success, data } = await fetchData("/charts/ventaMeses/");
      if (success) {
          const meses = [];
          const pedidos = [];
          data.forEach(({ mes, total_pedidos }) => {
              meses.push(mes);
              pedidos.push(total_pedidos);
          });
          // Actualizar el gráfico con los nuevos datos
          myChart3.data.labels = meses;
          myChart3.data.datasets[0].data = pedidos;
          myChart3.update();
      } else {
          manejarError("No se pudieron obtener los últimos pedidos."); // Proporcionar mensaje de error
      }
  } catch (error) {
      console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
      manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
  }
};
const mostrarCategorias = async () => {
  try {
      const { success, data } = await fetchData("/charts/topCategorias/");
      if (success) {
          const labels = [];
          const ventas = [];
          data.forEach(({ nombre_categoria, total_vendido }) => {
              labels.push(nombre_categoria);
              ventas.push(total_vendido);
          });
          // Actualizar el gráfico con los nuevos datos
          myChart4.data.labels = labels;
          myChart4.data.datasets[0].data = ventas;
          myChart4.update();
      } else {
          manejarError("No se pudieron obtener los últimos pedidos."); // Proporcionar mensaje de error
      }
  } catch (error) {
      console.log("Error al obtener los últimos pedidos:", error); // Imprimir error en consola para depuración
      manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
  }
};
const mostrarOlores = async () => {
  try {
      const { success, data } = await fetchData("/charts/topOlores/");
      if (success) {
          const labels = [];
          const ventas = [];
          data.forEach(({ nombre_olor, total_vendido }) => {
              labels.push(nombre_olor);
              ventas.push(total_vendido);
          });
          // Actualizar el gráfico con los nuevos datos
          myChart5.data.labels = labels;
          myChart5.data.datasets[0].data = ventas;
          myChart5.update();
      } else {
          manejarError("No se pudieron obtener los últimos pedidos."); // Proporcionar mensaje de error
      }
  } catch (error) {
      console.log( error); // Imprimir error en consola para depuración
      manejarError("Hubo un error al procesar la solicitud."); // Proporcionar mensaje de error
  }
};

// Crear el gráfico
const myChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
      labels: [],
      datasets: [{
          label: 'Ventas',
          data: [],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
          ],
      }]
  },
  options: {
      borderWidth: 2,
      hoverBorderWidth:0,
      plugins: {
          legend: {
              display: false,
          },
      },
      layout: {
          padding: {
              left: 50,
              right: 50,
              bottom: 50,
          }
      }
  },
});

const myChart2 = new Chart(ctx2, {
  type: 'doughnut',
  data: {
    labels:[],
    datasets: [{
      label: 'Ventas',
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',

      ],
    }]
  },
  options: {
    borderWidth: 2,
    hoverBorderWidth:0,

    plugins: {
      legend: {
        display: false,
      },
    },

    layout: {
      padding: {
        left: 50, // Ajusta el espaciado izquierdo
        right: 50, // Ajusta el espaciado derecho
        // Ajusta el espaciado superior
        bottom: 50, // Ajusta el espaciado inferior
      }
    }
  },
});

const myChart3 = new Chart(ctx3, {
    type:'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Ventas',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
  
        ],
      }]
    },
    options: {
      borderWidth: 2,
      hoverBorderWidth:0,
  
      plugins: {
        legend: {
          display: false,
        },
      },
  
      layout: {
        padding: {
          left: 50, // Ajusta el espaciado izquierdo
          right: 50, // Ajusta el espaciado derecho
          // Ajusta el espaciado superior
          bottom: 50, // Ajusta el espaciado inferior
        }
      }
    },

});
// Crear el gráfico
const myChart4 = new Chart(ctx4, {
  type: 'doughnut',
  data: {
      labels: [],
      datasets: [{
          label: 'Ventas',
          data: [],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
          ],
      }]
  },
  options: {
      borderWidth: 2,
      hoverBorderWidth:0,
      plugins: {
          legend: {
              display: false,
          },
      },
      layout: {
          padding: {
              left: 50,
              right: 50,
              bottom: 50,
          }
      }
  },
});
// Crear el gráfico
const myChart5 = new Chart(ctx5, {
  type: 'doughnut',
  data: {
      labels: [],
      datasets: [{
          label: 'Ventas',
          data: [],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
          ],
      }]
  },
  options: {
      borderWidth: 2,
      hoverBorderWidth:0,
      plugins: {
          legend: {
              display: false,
          },
      },
      layout: {
          padding: {
              left: 50,
              right: 50,
              bottom: 50,
          }
      }
  },
});