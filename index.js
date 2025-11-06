import express from 'express';
import cors from 'cors';
import { Server as SocketServer } from 'socket.io';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get("/info", (req, res) => {
  res.json({ message: "This is the info endpoint." });
});

// express started http server
const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})

// socket server gestartet
const io = new SocketServer(httpServer, {
  cors: {
    origin: "*",
  }
});

// socket connection event
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // sende nachricht gleich nach dem connect
  socket.emit("message", "Welcome new client!");

  // beispiel: jede sekunde sende ein UPDATE an den client
  // setInterval(() => {
  //   socket.emit("update", "Server Zeit: " + new Date().toLocaleTimeString());
  // }, 1000)

  // öffne einen socket message channel
  socket.on("message", (data) => {
    console.log("Received message from client:", data);

    // sendet an ALLE anderen user außer den sender
    socket.broadcast.emit("message", data);
    
    // sendet an ALLE anderen user und an den sender
    // io.emit("message", data);
  })

})