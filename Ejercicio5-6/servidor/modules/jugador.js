const VICTORIA = 0;
const DERROTA = 1;
const SEGUIR = 2;
class Jugador {
    constructor(nombre , turno) {
        this.nombre = nombre;
        this.puntos = 0;
        this.cartas = [];
        console.log("turno",turno);
        this.turno = turno;
    }
    cogerCarta(carta) {
        this.cartas.push(carta);
        let puntos = carta.numero;
        if(carta.numero>9) puntos = 0.5;
        this.sumarPuntos(puntos);   
    }
    sumarPuntos(puntos) {
        this.puntos += puntos;
    }
    getNombre() {
        return this.nombre;
    }
    getPuntos() {
        return this.puntos;
    }
    comprobarPuntos() {
        if(this.puntos>7.5) return DERROTA;
        else if(this.puntos==7.5) return VICTORIA;
        else return SEGUIR;
    }
    mostarCartas() {
        return this.cartas;
    }
    getBanca() {
        return this;
    }
}
export { Jugador };