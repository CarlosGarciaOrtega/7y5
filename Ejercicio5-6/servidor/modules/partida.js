import { Jugador } from "./jugador.js";
import { Baraja } from "./baraja.js";

const VICTORIA = 0;
const DERROTA = 1;
const SEGUIR = 2;
class Partida{
    constructor() {
        this.jugadores = new Map();
        this.baraja = new Baraja();

        
    }
    nuevoJugador(ws,turno) {
        console.log("turno3",turno);    
        this.jugadores.set(ws,new Jugador("noname",turno));
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
            jugador: jugador,
            carta: carta
        }
    }





}
export { Partida }