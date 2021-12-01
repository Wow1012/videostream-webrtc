const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const socket = require('socket.io')
const io = socket(server)
const cors = require("cors")
const { addUser, getUser, deleteUser, getUsers } = require('./user')

app.use(cors());

let broadcaster

io.on('connection', socket => {

    console.log("CLIENT CONNECTED", socket.id);

    //VIDEO BROADCATING
    socket.on("broadcaster", () => {
        broadcaster = socket.id;
        socket.broadcast.emit("broadcaster");
        console.log(`Broadcaster ${broadcaster} Connect`);
    });

    socket.on("watcher", () => {
        socket.to(broadcaster).emit("watcher", socket.id);
    })

    socket.on("disconnect", () => {
        socket.to(broadcaster).emit("disconnectPeer", socket.id);

        console.log("User disconnected");
        const user = deleteUser(socket.id)
        if (user) {
            io.in(user.room).emit('notification', { title: 'Someone just left', description: `${user.name} just left the room` })
            io.in(user.room).emit('users', getUsers(user.room))
        }
    })

    socket.on("offer", (id, message) => {
        socket.to(id).emit("offer", socket.id, message);
    });

    socket.on("answer", (id, message) => {
      socket.to(id).emit("answer", socket.id, message);
    });

    socket.on("candidate", (id, message) => {
      socket.to(id).emit("candidate", socket.id, message);
    });

    //MESSAGE CHATTING
    socket.on("login", ({name, room}, callback) => {
        console.log(name, room);
        const { user, error } = addUser(socket.id, name, room)
        if (error) return callback(error)
        socket.join(user.room)
        socket.in(room).emit('notification', { title: 'Someone\'s here', description: `${user.name} just entered the room` })
        io.in(room).emit('users', getUsers(room))
        callback()
    });

    socket.on("sendMessage", message => {
        console.log("Message:", message);
        const user = getUser(socket.id)
        io.in(user.room).emit('message', { user: user.name, text: message });
    });
})

const port = process.env.PORT || 8000

app.get('/', (req, res) => {
    res.send('Server is up and running')
})
server.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})