const socketio = require('socket.io');
const io = socketio();

const socketApi={};
socketApi.io = io;

const users = {}; //her gelen user'ın bilgilerini tutacak

const randomColor = require('../helpers/randomColor');

io.on('connection',(socket)=>{
    console.log('a user connected');

    socket.on('newUser',(data)=>{
       //console.log(data);
       const defaultData = {
           id: socket.id,
           position: {
               x: 0,
               y: 0
           },
           color: randomColor()
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

    socket.on('animate', (data) => {
        try{
            // console.log(data);
            //console.log(users);
            users[socket.id].position.x = data.x;
            users[socket.id].position.y = data.y;
            //console.log(users);

            socket.broadcast.emit('animate', {
                socketId: socket.id,
                x: data.x,
                y: data.y
            });

         }catch(e){
            console.log(e);
        }
    });

    socket.on('newMessage',data =>{
       //console.log(data);
        const messageData = Object. assign({ socketId: socket.id}, data);
        socket.broadcast.emit('newMessage', messageData);

    });
});

module.exports = socketApi;