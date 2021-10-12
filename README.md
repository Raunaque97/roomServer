# Room Server
To facilitate real-time communications between web clients.

A client creates a room,
the server sends a room code.
Other clients can join the same room using the code.
then broadcast messages between each other in real-time using socket.io.

hosted Server: [https://socker-room-server.herokuapp.com]()
##### Dependency 
socket.io-client v4.x 

## An Example App
An Example App can be found in the test folder. It uses all the APIs provided by the server to make a bare minimum chat app. 

The example chat app is also hosted in [netlify](https://chatdemousingroomserver.netlify.app/).

#### client side code 
```
import io from "socket.io-client";
var socket = io("https://socker-room-server.herokuapp.com/", {});
socket.emit("createRoom", {"username"})
...
socket.emit("pubMsg",{....})
...
```
## APIs 

### client to server:
```js
createRoom: {name: string} // make a room and join it with username as `name`, server responds with `newRoom`
join: {name: string, code: string} // join room with is as `code`  and username as `name`, server responds with `newRoom`
pubMsg: {data: any} // broadcast the data to all other connected clients in the same room.
getMembers: // server responds with `members`
```

### server to client:
```
newRoom: { code: string }
newMember: { name: string } // a new client has joined the room with username as `name`
removeMember: { name: string } // a client disconnected from the room
pubMsg: { sender: string, data: any } // braodcast
members: string[]
```

## Create Your Own servers
#### deploy in local
```bash
$git clone https://github.com/Raunaque97/roomServer.git
$cd roomServer && npm install
$npm start or $npm start-dev
```
#### deploy in heroku
```bash
$git clone https://github.com/Raunaque97/roomServer.git
$git push heroku master
```
