import { Jugador } from "./jugador.js";
class Partida{
    constructor() {
        this.jugadores = new Map();

        
    }
    nuevoJugador(ws,turno) {
        console.log("turno3",turno);
        this.jugadores.set(ws,new Jugador("noname",turno));
        return this.jugadores.get(ws);
    }
    borraJugador(ws) {
        this.jugadores.delete(ws);
    }





}
export { Partida }