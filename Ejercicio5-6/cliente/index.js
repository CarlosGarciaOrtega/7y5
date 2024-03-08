
const cliente = new WebSocket("ws://localHost:8081");
let comienzo=false;
let jugadorTurno;

let tablero = document.getElementById("tablero");
for (var i = 1; i <= 5; i++) {
    var div = document.createElement("div");
    div.id = "div-" + i;
    tablero.appendChild(div);
}



let operaciones = {
    list:[
        {
            type:"CASILLA",
            accion: dibujaCasilla
        },
        {
            type:"COMIENZO",
            accion: (content)=> comienzo=content
        },
        {
            type:"INFO",
            accion: dibujaInfo
        },
        {
            type:"CARTA",
            accion: dibujaCarta
        },
        {
            type:"CAMBIO_TURNO",
            accion: cambiarTurno
        },
        {
            type:"INFO_TURNO",
            accion: infoTurno
        },
        {
            type:"BANCA",
            accion: dibujarBanca

        }

    ]
}

cliente.onmessage = (message) => {
    try {
        let data = JSON.parse(message.data);
        if(!data.hasOwnProperty("type")) return;
        let operacion = operaciones.list.find((item)=> item.type===data.type);
        if(operacion!= undefined) {
            operacion.accion(data.content);
        }
        
    } catch(e) {
        console.log(e)
    } 
}





function dibujaCasilla(jugador){
    console.log("Jugador",jugador);
    console.log("Turno de jugador",jugadorTurno);
    if(jugadorTurno == undefined || jugadorTurno != jugador.turno   ) {
        console .log("entra");
        jugadorTurno = jugadorTurno == undefined ? jugador.turno : jugadorTurno;
        let id = jugador.turno;
        let contenedorNombre = document.createElement("h6");
        contenedorNombre.innerText=jugador.nombre;
        document.getElementById("div-"+id).appendChild(contenedorNombre);
    }
    
}



function dibujaInfo(informacion){
        document.getElementById("info").innerText="";
        document.getElementById("info").innerText=informacion;
}
function dibujaCarta(content){
    console.log("carta",content);
    let {jugador,carta} = content;
    let contenedorCarta = document.createElement("h6");
    contenedorCarta.innerText=carta.numero+" de "+carta.palo;
    document.getElementById("div-"+jugador.turno).appendChild(contenedorCarta);
}
function cambiarTurno(){
    console.log("cambio");  
    console.log(document.getElementById("div-"+jugadorTurno));

    document.getElementById("div-"+jugadorTurno).removeChild(document.getElementById("div-"+jugadorTurno).childNodes[1]);
    comienzo=false;
}

function infoTurno(informacion){
    let contenedorTurno = document.getElementById("div-"+jugadorTurno);
    if(informacion == jugadorTurno){

        let turno = document.createElement("h6");
        turno.innerText="Tu turno";
        contenedorTurno.appendChild(turno);
    }
    else{
        console.log("No es tu turno");
        contenedorTurno.removeChild(contenedorTurno.firstChild);
    }
}
function dibujarBanca(cartas){
    let contenedor = document.createElement("div");
    contenedor.id="banca";
    document.getElementById("tablero").appendChild(contenedor);

    let titulo = document.createElement("h6");
    titulo.innerText="Banca";
    contenedor.appendChild(titulo);

    cartas.forEach(carta => {
        let contenedorCarta = document.createElement("h6");
        contenedorCarta.innerText=carta.numero+" de "+carta.palo;
        contenedor.appendChild(contenedorCarta);
    });
}


document.getElementById("pedir").addEventListener("click",()=>{
    if(comienzo){
        cliente.send(JSON.stringify({type:"PEDIR",content:""}));
    }
});

document.getElementById("plantarse").addEventListener("click",()=>{
    if(comienzo){
        cliente.send(JSON.stringify({type:"PLANTARSE",content:""}));
    }
});





    