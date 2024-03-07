class Grafico {
    constructor(estadisticas, contenedor) {
        this.estadisticas = estadisticas;
        this.contenedor = contenedor;

        let grafica = document.createElement('canvas');
        console.log(grafica);

        new Chart(grafica, {
            type: 'line',
            data: {
                labels: this.estadisticas.labels,
                datasets: this.estadisticas.datos
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        console.log(this.contenedor);
        this.contenedor.appendChild(grafica);   
    }

    

   
}
export { Grafico }