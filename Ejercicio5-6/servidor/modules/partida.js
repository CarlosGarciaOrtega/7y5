import { Jugador } from "./jugador.js";
import { Baraja } from "./baraja.js";
import { Banca } from "./banca.js";

const VICTORIA = 0;
const DERROTA = 1;
const SEGUIR = 2;
const BANCA = 4;
class Partida {
    constructor() {
        this.jugadores = new Map();
        this.baraja = new Baraja();
        this.banca = new Banca("banca");
        this.turno = 1;
    }
    async nuevoJugador(ws, turno) {
        let nombre = await this.randomName();
        console.log("nombre", nombre);
        this.jugadores.set(ws, new Jugador(nombre, turno));
        return this.jugadores.get(ws);
    }
    borraJugador(ws) {
        this.jugadores.delete(ws);
    }
    coger(ws) {
        let jugador = this.jugadores.get(ws);
        let carta = this.baraja.sacarCarta();
        jugador.cogerCarta(carta);
        return {
            estado: jugador.comprobarPuntos(),
            info: {
                jugador: jugador,
                carta: carta
            }
        }
    }
    turnoActual() {
        return this.turno;
    }
    turnoSiguiente() {
        this.turno++;
        console.log("turnoPaartida camnio", this.turno);
        if (this.turno > this.jugadores.size) {
            console.log("holasss", this.turno);
            this.turno = 0;
            this.turnoBanca();
            return BANCA;

        }
        return this.turno;
    }
    turnoBanca() {
        [...this.jugadores.values()].forEach(jugador => {
            this.banca.verCartas(jugador.mostarCartas());
        });
        while (!this.banca.plantarse()) {
            this.banca.cogerCarta(this.baraja.sacarCarta());
        }
        return this.banca.mostrarCartas();
    }
    async randomName() {
        let nombre = await fetch("https://randomuser.me/api/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            return data.results[0].name.first;
        });

        return nombre;
    }
    ganador() {
        let ganador = null;
        [...this.jugadores.keys()].find((conexion) => {
            if (this.jugadores.get(conexion).comprobarPuntos() != DERROTA) {
                if (ganador == null) ganador = this.jugadores.get(conexion);
                else if (this.jugadores.get(conexion).getPuntos() > ganador.getPuntos())
                    ganador = this.jugadores.get(conexion);
            }
        });
        if (ganador.getPuntos() < this.banca.getPuntos() && this.banca.getPuntos() <= 7.5 ) ganador = this.banca;
        return ganador;
    }
    getBanca() {
        return this.banca;
    }   
}
export { Partida }