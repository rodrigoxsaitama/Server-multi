const { WebSocketServer } = require('ws');


const port = process.env.PORT || 8080;
const wss = new WebSocketServer({ port });


const baseDeDatos = {};

console.log(`Servidor de guardado activo en el puerto ${port}`);

wss.on('connection', (ws) => {
    console.log('¡Un jugador se ha conectado desde TurboWarp!');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            
            if (data.accion === "guardar") {
                if (!baseDeDatos[data.usuario]) {
                    // Si el usuario no existe, lo crea
                    baseDeDatos[data.usuario] = { pass: data.pass, progreso: data.progreso };
                    ws.send(JSON.stringify({ estado: "ok", mensaje: "Cuenta creada y partida guardada" }));
                } else if (baseDeDatos[data.usuario].pass === data.pass) {
                    // Si la contraseña coincide, actualiza el progreso
                    baseDeDatos[data.usuario].progreso = data.progreso;
                    ws.send(JSON.stringify({ estado: "ok", mensaje: "Partida actualizada" }));
                } else {
                    ws.send(JSON.stringify({ estado: "error", mensaje: "Contraseña incorrecta" }));
                }
            } 
          
            else if (data.accion === "cargar") {
                const cuenta = baseDeDatos[data.usuario];
                if (cuenta && cuenta.pass === data.pass) {
                    ws.send(JSON.stringify({ estado: "ok", progreso: cuenta.progreso }));
                } else {
                    ws.send(JSON.stringify({ estado: "error", mensaje: "Usuario o contraseña incorrectos" }));
                }
            }

        } catch (e) {
            ws.send(JSON.stringify({ estado: "error", mensaje: "Datos inválidos" }));
        }
    });
});
