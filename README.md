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

The example chat app is also hosted in [netlify](TODO).

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
createRoom: {name: string}
join: {name: string, code: string}
pubMsg: {data: any}
getMembers: 
```

### server to client:
```
newRoom: { code: string }
newMember: { name: string }
removeMember: { name: string }
pubMsg: { sender: string, data: any }
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
