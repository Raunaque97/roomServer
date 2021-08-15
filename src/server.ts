import express from "express";
// import cors from "cors";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
// import socketIo from 'socket.io'

const app = express();
app.use(express());
// app.use(cors());
const server = createServer(app);
server.listen(8000, () => {
  console.log("Server listening to port %s", 8000);
});
const io = new Server(server, {
  // parser: require("socket.io-msgpack-parser"), TODO https://socket.io/docs/v3/custom-parser/
  // ...
  /* @ts-ignore */
  //   origin: "*",
  cors: {
    origin: "*",
    // methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    // credentials: true,
    /* @ts-ignore */
    handlePreflightRequest: (req, res) => {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "GET,POST",
        // "Access-Control-Allow-Headers": "my-custom-header",
        // "Access-Control-Allow-Credentials": true,
      });
      res.end();
    },
  },
});

// types
export type Room = {
  code: string; // == socket.io room id/ roomCode
  locked: boolean;
  admins: Map<any, Member | undefined>; //  socketId -> Member
  members: Map<any, Member | undefined>; //  socketId -> Member
};
export type Member = {
  name: string;
  room: Room;
};

// objects
let members = new Map<any, Member>(); //  socketId -> Member
let rooms = new Map<string, Room>(); // roomCode -> Room

io.on("connection", (socket: Socket) => {
  //   console.log("socket connected, id:", socket.id);

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
        members.set(socket.id, { name: msg.name, room: r });
        r.members.set(socket.id, members.get(socket.id));

        socket.emit("newRoom", { code: r.code });

        // notify other clients
        socket.to(r.code).emit("newMember", {
          name: msg.name,
        });
      } else {
        // console.log("invalid code ", socket.id, msg);
        // invalid code do nothing
        return;
      }
    } else {
      //   console.log("invalid msg format ", socket.id);
    }
  });

  /**
   * broadcast to all other members in room
   * pubMsg: {data: any}
   */
  socket.on("pubMsg", (msg) => {
    // socket.rooms.keys()
    if (members.has(socket.id)) {
      /* @ts-ignore*/
      let m: Member = members.get(socket.id);
      socket.to(m.room.code).emit("pubMsg", {
        sender: m.name,
        data: msg.data,
      });
    }
  });

  /**
   * get all Members of the room
   * getMembers
   */
  socket.on("getMembers", () => {
    if (members.has(socket.id)) {
      /* @ts-ignore*/
      let m: Member = members.get(socket.id);
      let names: (string | undefined)[] = [];
      m.room.members.forEach((v, k) => {
        names.push(v?.name);
      });
      socket.emit("members", names);
    }
  });

  /**
   * create id msg.name == undefined do nothing
   *
   * createRoom: {name: string}
   */
  socket.on("createRoom", (msg) => {
    if (msg.name != undefined) {
      let code = (Math.random() + 1).toString(36).slice(2, 7);
      let r = {
        code: code,
        locked: false,
        admins: new Map(),
        members: new Map(),
      };
      rooms.set(code, r);
      socket.join(r.code);
      socket.emit("newRoom", { code: code });

      members.set(socket.id, { name: msg.name, room: r });
      r.members.set(socket.id, members.get(socket.id));
      r.admins.set(socket.id, members.get(socket.id));
    }
  });

  socket.on("disconnect", () => {
    if (members.has(socket.id)) {
      /* @ts-ignore*/
      let m: Member = members.get(socket.id);

      m.room.members.delete(socket.id);
      if (m.room.members.size == 0) {
        rooms.delete(m.room.code);
      } else {
        socket.to(m.room.code).emit("removeMember", {
          name: m.name,
        });
      }
      members.delete(socket.id);
    }
    // console.log("user disconnect...", socket.id);
  });

  socket.on("error", function (err) {
    // console.log("received error from user:", socket.id, err);
  });
});
