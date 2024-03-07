class Baraja{
    constructor(){
        this.palos = ['Oros', 'Copas', 'Espadas', 'Bastos'];
        this.numeros = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
        this.baraja = [];
        let carta = {
            palo: null,
            numero:null,
        }
        this.numeros.forEach(numero => {
            this.palos.forEach(palo => {
                carta.palo = palo;
                carta.numero = numero;
                this.baraja.push({...carta});
            });
        }); 
    };

    sacarCarta(){
        let cartaAleatoria = Math.floor(Math.random() * this.baraja.length);
        return this.baraja.splice(cartaAleatoria,1)[0];
    };
}

export {Baraja}