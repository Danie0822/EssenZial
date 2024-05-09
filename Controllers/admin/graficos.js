const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2');
const ctx3 = document.getElementById('myChart3');
const marcas = ['Montblanc', 'Calvin Klein', 'Salvatore Ferragamo', 'Azzaro', 'Paco Rabanne'];
const marcas2 = ['Montblanc', 'Calvin Klein', 'Salvatore Ferragamo', 'Azzaro', 'Paco Rabanne'];
const porcentajes = [10, 15, 20, 25, 30];
const porcentajes2 = [5, 25, 20, 35, 30];
const meses =['Enero', 'Febrero', 'Marzo'];
const ventas = [10, 50, 70];



// Definir función para manejar errores
function manejarError(mensaje) {
  console.error("Error:", mensaje);
  // Aquí puedes implementar lógica adicional para manejaar el error, como mostrar un mensaje al usuario
}

// Función para mostrar los últimos pedidos en el gráfico
const mostrarUltimosPedidos = async () => {
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
    labels: marcas2,
    datasets: [{
      label: 'Porcentaje',
      data: porcentajes2,
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
      labels: meses,
      datasets: [{
        label: 'Ventas',
        data: ventas,
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

document.addEventListener("DOMContentLoaded", function () {
  // Obtener cuando recarga pagina 
  mostrarUltimosPedidos();
});