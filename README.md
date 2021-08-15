and client creates a room
server sends a room code.
Other clients can join the same room using the code.
then broadcast messages between each other in realtime using socket.io


APIs 

server
createRoom: {name: string}
join: {name: string, code: string}
pubMsg: {data: any}
getMembers

client
newRoom: { code: string }
newMember: { name: string }
removeMember: { name: string }
pubMsg: { sender: string, data: any }
members: string[]
