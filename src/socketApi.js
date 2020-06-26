const socketio = require('socket.io');
const io = socketio();
const socketApi = { };

socketApi.io = io;

const users = [ ];

io.on('connection', (socket) => {
    console.log("foydalanuvchi boglandi");

    socket.on('newUser', (data) => {
        const defaultData = {
            id: socket.id,
            position: {
                x: 0,
                y: 0
            }
        };

        const userData = Object.assign(data, defaultData);
        //console.log(userData);
        users.push(userData);


        socket.broadcast.emit('newUser', userData);
    });
});

module.exports = socketApi;