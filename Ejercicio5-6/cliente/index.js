

const cliente = new WebSocket("ws://localHost:8081");
let comienzo=false;

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
            console.log(data.content);
        }
        
    } catch(e) {
        console.log(e)
    } 
}





function dibujaCasilla(jugador){
    let id = jugador.turno;
    console.log("jugadorID",jugador);
    console.log(document.getElementById("div-"+id));
    let contenedorNombre = document.createElement("h6");
    contenedorNombre.innerText=jugador.nombre;
    document.getElementById("div-"+id).appendChild(contenedorNombre);
}



function dibujaInfo(informacion){
    document.getElementById("info").innerText="";
    document.getElementById("info").innerText=informacion;
}


document.getElementById("pedir").addEventListener("click",()=>{
    if(comienzo){
        cliente.send(JSON.stringify({type:"PEDIR",content:""}));
    }
});





    