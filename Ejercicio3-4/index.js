import { Baraja } from './baraja.js';
import { Banca } from './banca.js';

let contenedor = document.getElementById('contenedor');
let mensajeContenedor = document.querySelector('#contenedor span');
let cartas = document.querySelector('#cartas span');
let puntuacion = document.querySelector('#puntuacion span');
let cartasBanca = document.querySelector('#cartasBanca span');
let puntuacionBanca = document.querySelector('#puntuacionBanca span');
let tiempoId;

let baraja = new Baraja();
let jugador = {
    nombre: 'Carlos',
    puntuacion: 0,
    cartas: []
}

let boton = document.createElement('button');
boton.innerHTML = 'Pedir carta';
boton.addEventListener('click', sacarCarta);
contenedor.appendChild(boton);
let boton2 = document.createElement('button');
boton2.innerHTML = 'Plantarse';
boton2.addEventListener('click', turnoBanca);
contenedor.appendChild(boton2);

let boton3 = document.createElement('button');
boton3.innerHTML = 'Volver a jugar';
boton3.addEventListener('click', volverJugar);
contenedor.appendChild(boton3);




function mensajeFinal(contenedor, mensaje) {
    let title = document.createElement('h1');
    title.textContent = mensaje;
    contenedor.appendChild(title);
    eliminarBotones();
    console.log(tiempoId);
    if(tiempoId) clearTimeout(tiempoId);
}
function sacarCarta() {
    let carta = baraja.sacarCarta();
    jugador.cartas.push(carta);
    if (carta.numero > 9) jugador.puntuacion += 0.5;
    else jugador.puntuacion += carta.numero;
    if (jugador.puntuacion > 7.5) {
        mensajeFinal(mensajeContenedor, 'Has Perdido');
    }else if (jugador.puntuacion == 7.5) {
        mensajeFinal(mensajeContenedor, 'Has Ganado');
    }else{
        limiteTiempo();
    }
    dibujaCarta(cartas, carta);
    sumarPuntuacion(puntuacion, jugador.puntuacion);
    
}
function turnoBanca() {
    if(tiempoId) clearTimeout(tiempoId);
    juegaBanca(jugador);
    eliminarBotones();
}

function juegaBanca(jugador) {
    let banca = new Banca('Banca')
    console.log(jugador);
    banca.verCartas(jugador.cartas);
    let carta = baraja.sacarCarta();
    banca.cogerCarta(carta);
    dibujaCarta(cartasBanca, carta);
    sumarPuntuacion(puntuacionBanca, jugador.puntuacion);
    let vBanca = false;
    while (!banca.plantarse() && !vBanca) {
        carta = baraja.sacarCarta();
        banca.cogerCarta(carta);
        dibujaCarta(cartasBanca, carta);
        sumarPuntuacion(puntuacionBanca, banca.puntos);
        vBanca = banca.puntos == 7.5 || banca.puntos >= jugador.puntuacion && banca.puntos <= 7.5 ? true : false;
    }
    if (vBanca) mensajeFinal(mensajeContenedor, 'Has perdido')
    else mensajeFinal(mensajeContenedor, 'Has ganado')
}
function eliminarBotones() {
    boton.removeEventListener('click', sacarCarta)
    boton2.removeEventListener('click', turnoBanca)

}

function dibujaCarta(contenedor, carta) {
    let cartas = document.createElement('h4');
    console.log(contenedor);
    console.log(carta);
    cartas.textContent = carta.numero + " de " + carta.palo;
    contenedor.appendChild(cartas);
}
function sumarPuntuacion(contenedor, puntos) {
    contenedor.textContent = puntos;

}

function volverJugar() {
    baraja = new Baraja();
    jugador.puntuacion = 0;
    jugador.cartas = [];
    boton.addEventListener('click', sacarCarta)
    boton2.addEventListener('click', turnoBanca)
    cartas.innerHTML = '';
    puntuacion.textContent = 0
    cartasBanca.innerHTML = '';
    puntuacionBanca.textContent = 0
    mensajeContenedor.innerHTML = "";
}

function limiteTiempo() {
   if(tiempoId) clearTimeout(tiempoId);
   tiempoId = setTimeout(() => {
        turnoBanca();
        eliminarBotones();
        mensajeFinal(mensajeContenedor, 'Se te ha acabado el tiempo, la banca juega');
    }, 5000);
}