var socket = io("https://socker-room-server.herokuapp.com/", {});
// var socket = io("http://localhost:8000", {
//   //   withCredential: true,
// });

// console.log(socket);
socket.on("create", (msg) => {
  msg.forEach((item) => {});
});

var code = document.getElementById("code");
var roomId;
var userName;
var msg2send;

var members = [];

onJoin = () => {
  console.log("join:", roomId);
  socket.emit("join", { name: userName, code: roomId });
  members.push(userName);
  renderUsers();
  socket.emit("getMembers");
};

onCreate = () => {
  console.log("create");
  socket.emit("createRoom", { name: userName });
  members.push(userName);
  renderUsers();
  socket.emit("getMembers");
};

onSend = () => {
  console.log("send");
  socket.emit("pubMsg", { data: msg2send });
  addMsg(userName + " : " + msg2send);
};

document.getElementById("room").hidden = true;

socket.on("newRoom", (msg) => {
  code.innerText = "joined room: " + msg.code;
  document.getElementById("room").hidden = false;
  renderUsers();
});

socket.on("pubMsg", (msg) => {
  console.log("pubMsg", msg);
  addMsg(msg.sender + " : " + msg.data);
});

socket.on("newMember", (msg) => {
  members.push(msg.name);
  renderUsers();
});

socket.on("members", (msg) => {
  members = msg;
  renderUsers();
});

socket.on("removeMember", (msg) => {
  console.log("user disconnected ", msg.name);
  members = members.filter((member) => {
    return member != msg.name;
  });
  renderUsers();
});

function renderUsers() {
  //   console.log(members);
  while (users.firstChild) {
    users.removeChild(users.firstChild);
  }
  members.forEach((name) => {
    addUsers(name);
  });
}
var users = document.getElementById("users");
function addUsers(user) {
  var user_element = document.createElement("li");
  user_element.innerText = user;
  users.appendChild(user_element);
}
var msgs = document.getElementById("msgs");
function addMsg(msg) {
  var msg_element = document.createElement("li");
  msg_element.innerText = msg;
  msgs.appendChild(msg_element);
}
