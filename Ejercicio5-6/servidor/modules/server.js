import { WebSocketServer } from 'ws';
import { Partida } from "./partida.js";


const VICTORIA = 0;
const DERROTA = 1;
const SEGUIR = 2;
const BANCA = 4;

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



        this.server.on("connection", async (ws) => {
            if (this.clientes.size >= 5) {
                this.send("INFO", "Limite de jugadores alcanzado", ws);
                ws.close();


            } else {
                this.clientes.add(ws);
                console.log("Nuevo cliente conectado", this.clientes.size);
                let player = await this.juego.nuevoJugador(ws, this.clientes.size);

                this.send("COMIENZO", false, ws);
                this.send("CASILLA", player,ws);
                this.send("INFO", "Esperando jugadores", ws);
                if (this.clientes.size == 3) {
                    this.server.clients.forEach((client) => {
                        this.send("INFO", "Comienza la partida", client);
                        this.send("INFO_TURNO", this.juego.turnoActual(), client);
                        player = this.juego.jugadores.get(client);
                        this.send("CASILLA", player);
                        if (this.juego.turnoActual() == this.juego.jugadores.get(client).turno) {
                            this.send("COMIENZO", true, client);
                        }
                    });
                }
            }

            ws.on("message", (data) => {
                console.log(JSON.parse(data));
                this.do(data, ws);
                //this.send("CARTAS", " ");
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
            console.log("A todos los clientes conectados");
            console.log(tipo, contenido);
            this.server.clients.forEach((client) => {
                client.send(JSON.stringify(mensaje));
            });
            //Si la conexion es indefinida e4s  un mensaje a todos los clientes
            /*
                        // Enviar la lista de jugadores a todos los clientes conectados
                        let jugadores = [...this.board.jugadores.values()].map((item) => {
                            return item;
                        });

                        this.server.clients.forEach((client) => {
                            this.send("PLAYERS", jugadores, client);
                        });
            */
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
        if (this.juego.turnoActual() != this.juego.jugadores.get(ws).turno) return;

        console.log("Pedir");
        let mensaje = this.juego.coger(ws);
        console.log(mensaje);
        if (mensaje.estado == DERROTA) {
            this.send("INFO", "Has perdido", ws);
            this.send("COMIENZO", false, ws);
        } else if (mensaje.estado == VICTORIA) {
            this.send("INFO", "Has ganado", ws);
            this.send("COMIENZO", false, ws);
        }

        this.send("CARTA", mensaje.info);

        if (mensaje.estado == DERROTA || mensaje.estado == VICTORIA) {
            this.cambioTurno(ws);
            
        }

    }
    cambioTurno(ws) {
        let banca = this.juego.turnoSiguiente(ws);
        if (banca == BANCA) {
            let cartas = this.juego.turnoBanca();
            let banca = this.juego.banca;
            console.log("banca", banca);    
            this.send("CASILLA",banca );
            this.send("BANCA", cartas);
            let ganador = this.juego.ganador();
            this.send("INFO", "Fin de la partida.Ha ganado"+ganador.getNombre());	
        }


        [...this.juego.jugadores.keys()].find((conexion) => {
            if (this.juego.turnoActual() == this.juego.jugadores.get(conexion).turno) {
                this.send("COMIENZO", true, conexion);
                this.send("INFO_TURNO", this.juego.turnoActual(), conexion);
            }

        });
    }


    plantarse(content, ws) {
        
        this.send("INFO", "Te has plantado", ws);
        this.send("COMIENZO", false, ws);
        this.cambioTurno(ws);
    }


   
}

export { Server }