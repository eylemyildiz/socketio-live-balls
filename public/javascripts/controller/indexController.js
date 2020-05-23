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

    function initSocket(username){
        const connectionOptions = {
            reconnectionAttepts: 3,
            reconnectionDelay: 600
        };

        indexFactory.connectSocket('http://localhost:3000',connectionOptions)
            .then((socket)=>{
                //console.log('bağlantı gerçekleşti',socket);
                socket.emit('newUser', {username});

                socket.on('initPlayers',(players)=>{
                    $scope.players = players;
                    $scope.$apply(); //ön tarafa yansıması için apply işlemini yapıyoruz.
                    //console.log($scope.players);
                });

                socket.on('newUser', (data) =>{
                    //console.log(data);
                    const messageData = {
                        type : {
                           code: 0, //info -> sunucu tarafından gönderilen mesaj gibi düşünelim dedik.Eylem giriş yaptı gibi.
                           message: 1 //login oldugu anlamina gelsin diye set ettik
                        },
                        username: data.username
                    };
                    $scope.messages.push(messageData);
                    $scope.$apply();
                });

                socket.on('disUser', (data) =>{
                   console.log(data);
                    const messageData = {
                        type : {
                            code: 0, //info -> sunucu tarafından gönderilen mesaj gibi düşünelim dedik
                            message: 0 //logout oldugu anlamina gelsin diye set ettik
                        },
                        username: data.username
                    };
                    $scope.messages.push(messageData);
                    $scope.$apply();
                });

                let animate = false;
                $scope.onClickPlayer = ($event) =>{
                    //console.log($event.offsetX, $event.offsetY);
                    if(!animate) //Eger devam eden bir animasyon yoksa şu animasyonu çalıştır diyoruz.
                    {
                        animate = true; //animasyon devam ederken true bittiğinde de false olacak
                        $('#' + socket.id).animate({'left': $event.offsetX, 'top': $event.offsetY}, () => {
                            animate = false;
                        });
                    }
                };
            }).catch((err) => {
            console.log(err);
        });
    }
}]);