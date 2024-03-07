import { WebSocketServer } from 'ws';
import { Partida } from "./partida.js";


const NOTIFY = 0;
const PARTIDA_ID = 1;

class Server {
    constructor() {
        this.clientes = new Set();
        this.server = new WebSocketServer({ port: 8081 });
        this.juego = new Partida();

        this.operaciones = {
            list: [
                {
                    type: "PEDIR",
                    accion: (content, ws) => this.coger(content, ws)
                },
                {
                    type: "PLANTARSE",
                    accion: (content, ws) => this.plantarse(content, ws)
                },
            ]
        }



        this.server.on("connection", (ws) => {
            if (this.clientes.size >= 3) {
                this.send("INFO", "Limite de jugadores alcanzado", ws);
                ws.close();


            } else {
                this.clientes.add(ws);
                console.log("Nuevo cliente conectado", this.clientes.size);
                let player = this.juego.nuevoJugador(ws, this.clientes.size);
                this.send("COMIENZO", false, ws);
                this.send("CASILLA", player, ws);
                this.send("INFO", "Esperando jugadores", ws);
                if (this.clientes.size == 1) {
                    this.server.clients.forEach((client) => {
                        this.send("INFO", "Comienza la partida", client);
                        this.send("COMIENZO", true, ws);

                    });

                }

            }

            ws.on("message", (data) => {
                console.log(JSON.parse(data));  
                this.do(data, ws);
                //this.send("PLAYERS", ws);
            });


            ws.on("close", () => {
                this.clientes.delete(ws);
                this.juego.borraJugador(ws);
            });
        });
    }

    send(tipo, contenido, conexion) {
        let mensaje = {
            type: tipo,
            content: contenido
        }

        if (conexion != undefined) {
            conexion.send(JSON.stringify(mensaje));
        }
        else {
            //Si la conexion es indefinida e4s  un mensaje a todos los clientes
            let jugadores = [...this.board.jugadores.values()].map((item) => {
                return item;
            });


            this.server.clients.forEach((client) => {
                this.send("PLAYERS", jugadores, client);

            });
        }
    }

    do(data, ws) {
        try {
            let message = JSON.parse(data);
            if (!message.hasOwnProperty("type")) return;
            let operacion = this.operaciones.list.find((item) => item.type === message.type);
            if (operacion != undefined) operacion.accion(message.content, ws);

        } catch (e) {
            console.log(e);
        }
    }

    coger(content, ws) {
        console.log("Pedir");
        let carta  = this.juego.coger(ws);
        this.send("CARTA",carta ,ws);

    }


    moverse(content, ws) {
        let jugadorid = this.board.moverse(ws);
        this.send("CASILLA", this.board.getPlayer(ws), ws);
        console.log(jugadorid);


    }

    rotar(content, ws) {
        this.board.rotar(content, ws);

    }

    disparar(content, ws) {

        let jugadorEliminado = this.board.disparar(ws);
        if (jugadorEliminado != null) {
            this.send("COMIENZO", false, jugadorEliminado.conexion);
            this.send("INFO", "Has muerto", jugadorEliminado.conexion);
            this.send("INFO", "Has matado a " + jugadorEliminado.nombre, ws);

            if (this.board.players.size == 1) {
                this.send("COMIENZO", false, ws);
                this.send("INFO", "Has ganado", ws);
                //Aqui como la partida ha acabado podemos borrar de la base de datos los jugadores
                this.delete();
            }
        } else {
            this.send("INFO", "Has fallado", ws);
        }


    }
}

export { Server }