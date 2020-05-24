app.controller('indexController',['$scope','indexFactory',($scope, indexFactory)=>{

    //angular da bir array'i html dosyasında nasıl listelenir
    $scope.messages = [];
    $scope.players = {};

    $scope.init = () =>{
      const username= prompt('Please enter username');

      if(username)
         initSocket(username);
      else
         return false;
    };


    function scrollTop(){
        setTimeout(() => {
            const element = document.getElementById('chat-area');
            element.scrollTop = element.scrollHeight;
        });
    }

    function showBubble(id, message){
        $('#' + id).find('.message').show().html(message);

        setTimeout(()=>{
            $('#' + id).find('.message').hide();
        },2000);
    }

    async function initSocket(username)
    {
        const connectionOptions = {
            reconnectionAttepts: 3,
            reconnectionDelay: 600
        };

        try {
            const socket = await indexFactory.connectSocket('http://localhost:3000', connectionOptions);
            //console.log('bağlantı gerçekleşti',socket);
            socket.emit('newUser', {username});

            socket.on('initPlayers', (players) => {
                $scope.players = players;
                $scope.$apply(); //ön tarafa yansıması için apply işlemini yapıyoruz.
                //console.log($scope.players);
            });

            socket.on('newUser', (data) => {
                //console.log(data);
                const messageData = {
                    type: {
                        code: 0, //info -> sunucu tarafından gönderilen mesaj gibi düşünelim dedik.Eylem giriş yaptı gibi.
                        message: 1 //login oldugu anlamina gelsin diye set ettik
                    },
                    username: data.username
                };
                $scope.messages.push(messageData);
                $scope.players[data.id] = data;
                scrollTop();
                $scope.$apply();
            });

            socket.on('disUser', (data) => {
                console.log(data);
                const messageData = {
                    type: {
                        code: 0, //info -> sunucu tarafından gönderilen mesaj gibi düşünelim dedik
                        message: 0 //logout oldugu anlamina gelsin diye set ettik
                    },
                    username: data.username
                };
                $scope.messages.push(messageData);
                delete $scope.players[data.id];
                scrollTop();
                $scope.$apply();
            });

            socket.on('animate', (data) => {
                //console.log(data);
                $('#' + data.socketId).animate({'left': data.x, 'top': data.y}, () => {
                    animate = false;
                });
            });

            socket.on('newMessage', message => {
                $scope.messages.push(message);
                $scope.$apply();
                showBubble(message.socketId, message.text)
                scrollTop();
            });

            let animate = false;
            $scope.onClickPlayer = ($event) => {
                //console.log($event.offsetX, $event.offsetY);
                if (!animate) //Eger devam eden bir animasyon yoksa şu animasyonu çalıştır diyoruz.
                {
                    let x = $event.offsetX;
                    let y = $event.offsetY;

                    socket.emit('animate', {x, y});

                    animate = true; //animasyon devam ederken true bittiğinde de false olacak
                    $('#' + socket.id).animate({'left': x, 'top': y}, () => {
                        animate = false;
                    });
                }
            };

            $scope.newMessage = () => {
                let message = $scope.message;
                console.log(message);

                const messageData = {
                    type: {
                        code: 1 //info -> kullanıcı tarafından gelecek mesaj için kullanılıyor.Kullanıcı tarafı olduğu için1 .
                    },
                    username: username,
                    text: message
                };
                $scope.messages.push(messageData);
                console.log(messageData.type);
                $scope.message = '';

                socket.emit('newMessage', messageData);

                showBubble(socket.id, message);
                scrollTop();
            };
        }catch(err){
            console.log(err);
        }
    }
}]);