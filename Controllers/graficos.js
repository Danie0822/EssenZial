const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2');
const marcas = ['Montblanc', 'Calvin Klein', 'Salvatore Ferragamo', 'Azzaro', 'Paco Rabanne'];
const marcas2 = ['Montblanc', 'Calvin Klein', 'Salvatore Ferragamo', 'Azzaro', 'Paco Rabanne'];
const porcentajes = [10, 15, 20, 25, 30];
const porcentajes2 = [5, 25, 20, 35, 30];

const myChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: marcas,
    datasets: [{
      label: 'Porcentaje',
      data: porcentajes,
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

