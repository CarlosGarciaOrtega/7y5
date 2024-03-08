class Banca {

    constructor(nombre) {
        this.MAX_PUNTOS = 7.5;
        this.VALOR_CARTA = 0.5;
        this.nombre = nombre;
        this.puntos = 0;
        this.cartas = [];
        this.cartasSacadas=[];
    }

    cogerCarta(carta) {
        this.cartas.push(carta);
        if (carta.numero > 9) this.puntos += this.VALOR_CARTA;
        else this.puntos += carta.numero;

    }
    plantarse() {
        let cartaMinima = this.MAX_PUNTOS - this.puntos;
        let cartasDisponibles = [10, 11, 12, 1, 2, 3, 4, 5, 6, 7];
        let numCartasBajas = 0;
        let numCartasAltas = 0;
        let puntuacionEntera = cartasDisponibles.includes(cartaMinima);
        if (!puntuacionEntera) cartaMinima = cartaMinima - 0.5;
        let indiceCartaMin = cartasDisponibles.indexOf(cartaMinima);
        numCartasAltas = (cartasDisponibles.length - indiceCartaMin) * 4;
        numCartasBajas = (indiceCartaMin + 1) * 4;
        this.cartas.forEach(carta => {
            
            if (cartasDisponibles.includes(carta.numero)) {
                if (carta.numero < cartaMinima || carta.numero > 9) numCartasBajas--;
                else numCartasAltas--;
            }
        });
        this.cartasSacadas.forEach(carta => {
            
            if (cartasDisponibles.includes(carta.numero)) {
                if (carta.numero < cartaMinima || carta.numero > 9) numCartasBajas--;
                else numCartasAltas--;
            }
        });
        return numCartasAltas > numCartasBajas ? true : false;
    }
    mostrarCartas() {
        return this.cartas;
    }
    verCartas(cartasSacadas){
        cartasSacadas.forEach(carta => {
            this.cartasSacadas.push(carta);
        });
    }
    getPuntos() {
        return this.puntos;
    }
    getNombre() {
        return this.nombre;
    }
}
export { Banca };