const socketio = require('socket.io');
const io = socketio();

const socketApi={};
socketApi.io = io;

const users = {}; //her gelen user'ın bilgilerini tutacak

io.on('connection',(socket)=>{
    console.log('a user connected');

    socket.on('newUser',(data)=>{
       //console.log(data);
       const defaultData = {
           id: socket.id,
           position: {
               x: 0,
               y: 0
           }
       }

       const userData = Object.assign(data, defaultData);
       //console.log(userData);
       //users.push(userData);
        users[socket.id] = userData;
        console.log(users);
        //Bir kullanıcı gridiğinde diğer kullanıcıları bilgilendirme
        socket.broadcast.emit('newUser',users[socket.id]);
        socket.emit('initPlayers',users);
    });

    socket.on('disconnect',()=>{
        socket.broadcast.emit('disUser',users[socket.id]);
        delete users[socket.id];

        console.log(users);
    });

    socket.on('animate', (data) =>{
       // console.log(data);
        //console.log(users);
        users[socket.id].position.x = data.x;
        users[socket.id].position.y = data.y;
        //console.log(users);

        socket.broadcast.emit('animate',{
            socketId: socket.id,
            x: data.x,
            y: data.y
        });
    });
});

module.exports = socketApi;