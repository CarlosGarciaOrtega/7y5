import { Baraja } from './baraja.js';
import { Jugador } from './jugador.js';
import { Grafico } from './grafico.js';

//Ejercicio 1 y 2
let estadisticas = [];
function partida(numeroPartida) {
    let jugador = new Jugador('Pepe')
    let banca = new Jugador('Banca')
    let baraja = new Baraja();
    let vJugador = false;
    let vBanca = false;
    let statJugador = {
        partida: numeroPartida,
        nombre: jugador.nombre,
        puntos: 0,
        cartas: 0,
        victoria: null,
    };
    let statBanca = {
        partida: numeroPartida,
        nombre: banca.nombre,
        puntos: 0,
        cartas: 0,
        victoria: null,
    }

    jugador.cogerCarta(baraja.sacarCarta());
    while (!jugador.plantarse() && !vJugador) {
        jugador.cogerCarta(baraja.sacarCarta());
        vJugador = jugador.puntos == 7.5 ? true : false;
    }
    statJugador.puntos = jugador.puntos;
    statJugador.cartas = jugador.cartas.length;

    console.log('victoria', vJugador);
    console.log('Puntos', jugador.puntos);


    if (vJugador) {
        statJugador.victoria = true;
        statBanca.victoria = false;
        console.log('if');
    } else if (jugador.puntos > 7.5) {
        statJugador.victoria = false;
        statBanca.victoria = true;
        console.log('elsseif');

    } else {
        console.log('else');

        banca.verCartas(jugador.mostrarCartas());
        banca.cogerCarta(baraja.sacarCarta());
        while (!jugador.plantarse() && !vBanca) {
            banca.cogerCarta(baraja.sacarCarta());
            vBanca = banca.puntos == 7.5 || banca.puntos >= jugador.puntos ? true : false;
        }
        statBanca.puntos = banca.puntos;
        statBanca.cartas = banca.cartas.length;

        if (vBanca) {
            statJugador.victoria = false;
            statBanca.victoria = true;
        } else {
            statJugador.victoria = true;
            statBanca.victoria = false;
        }
    }

    estadisticas.push(statJugador);
    estadisticas.push(statBanca);

}

for (let i = 1; i < 200; i++) {
    partida(i);
}


let jugadores = ['Pepe', 'Banca']

jugadores.forEach(jugador => {
    let graficaJugador = {
        labels: [],
        datos: []

    }

    let cartas = {
        label: 'Cartas',
        data: []
    };
    let victorias = {
        label: 'Victorias',
        data: []
    };
    let puntos = {
        label: 'Puntos',
        data: []
    };
    estadisticas.filter(estadistica => estadistica.nombre == jugador).forEach(estadistica => {
        graficaJugador.labels.push('Partida ' + estadistica.partida);
        victorias.data.push(estadistica.victoria);
        puntos.data.push(estadistica.puntos);
        cartas.data.push(estadistica.cartas);

    });
    graficaJugador.datos.push(cartas);
    graficaJugador.datos.push(victorias);
    graficaJugador.datos.push(puntos);
    let div = document.getElementById('grafico');
    let nombre = document.createElement('h1');
    nombre.innerHTML = 'Grafico de ' + jugador;
    div.appendChild(nombre);
    new Grafico(graficaJugador, div);
})











