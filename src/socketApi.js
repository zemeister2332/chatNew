const socketio = require('socket.io');
const randomColors = require('../helper/randomColor');

const io = socketio();
const socketApi = { };

socketApi.io = io;

const users = { };

io.on('connection', (socket) => {
    console.log("foydalanuvchi boglandi");

    socket.on('newUser', (data) => {
        const defaultData = {
            id: socket.id,
            position: {
                x: 0,
                y: 0
            },
            color: randomColors()
        };

        const userData = Object.assign(data, defaultData);

        users[socket.id] = userData
        //console.log(users);

        socket.broadcast.emit('newUser', users[socket.id]);
        socket.emit('initPlayers', users);

        socket.on('disconnect', () => {
           socket.broadcast.emit('disUser', users[socket.id])

            delete users[socket.id]
            console.log(users)
        });
    });

    socket.on('animate', (data) => {
        try {
            users[socket.id].position.x = data.x;
            users[socket.id].position.y = data.y;
            //console.log(users);

            socket.broadcast.emit('animate', {
                socketId: socket.id,
                x:data.x,
                y:data.y
            })
        }catch(e){
            console.log(e)
        }
    });

    socket.on('newMessage', data => {
        socket.broadcast.emit('newMessage', data)
    });

});

module.exports = socketApi;