import express from "express";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
// import socketIo from 'socket.io'

const app = express();
app.use(express());
app.use(cors());
const server = createServer(app);
server.listen(8000, () => {
  console.log("Server listening to port %s", 8000);
});
const io = new Server(server, {
  // parser: require("socket.io-msgpack-parser"), TODO https://socket.io/docs/v3/custom-parser/
  // ...
  cors: {
    origin: "*",
    // credentials: true,
  },
});

// types
export type Room = {
  code: string; // == socket.io room id/ roomCode
  locked: boolean;
  admins: string[];
};

// objects
let rooms = new Map<string, Room>(); // roomCode -> Room

io.on("connection", (socket: Socket) => {
  console.log("socket connected, id:", socket.id);

  /**
   * if invalid code do nothing
   * else join room
   *
   * join: {name: string, code: string}
   */
  socket.on("join", (msg) => {
    // let r: Room;
    if (msg.code != undefined && msg.name != undefined) {
      if (rooms.has(msg.code)) {
        /* @ts-ignore */
        let r: Room = rooms.get(msg.code);
        socket.join(r.code); // join socket.io room of same name

        socket.emit("newRoom", { code: r.code });

        // notify other clients
        socket.to(r.code).emit("newMember", {
          name: msg.name,
        });
      } else {
        // invalid code do nothing
        return;
      }
    }
  });

  // broadcast to all other members in room
  socket.on("pubMsg", (msg) => {
    console.log(socket.rooms);
  });

  // create
  socket.on("createRoom", (msg) => {
    let code = (Math.random() + 1).toString(36).slice(2, 7);
    rooms.set(code, {
      code: code,
      locked: false,
      admins: [],
    });
    socket.emit("newRoom", { code: code });
  });

  socket.on("disconnect", () => {
    // if (players.has(socket.id)) {
    //   let p = players.get(socket.id);
    //   p.game.players.delete(p.gameProps.gameId);
    //   p.game = undefined;
    //   // p.gameProps = undefined;
    //   players.delete(socket.id);
    // }

    console.log("user disconnect...", socket.id);
  });

  socket.on("error", function (err) {
    console.log("received error from user:", socket.id);
    console.log(err);
  });
});
