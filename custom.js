var ctx = document.getElementById('canvas').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
        datasets: [{
            label: 'Batimentos Cardíacos',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor:'transparent',
            borderColor:'#374F69',
            borderWidth: 4
        }]
    },
    options: {
        elements:{
            line:
             tension:30
        }
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});