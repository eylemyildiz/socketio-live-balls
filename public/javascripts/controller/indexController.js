app.controller('indexController',['$scope','indexFactory',($scope, indexFactory)=>{

    //angular da bir array'i html dosyasında nasıl listelenir
    $scope.messages = [];


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

                socket.on('newUser', (data) =>{
                    //console.log(data);
                    const messageData = {
                        type : 0, //info -> sunucu tarafından gönderilen mesaj gibi düşünelim dedik.Eylem giriş yaptı gibi.
                        username: data.username
                    };
                    $scope.messages.push(messageData);
                    $scope.$apply();
                });
            }).catch((err) => {
            console.log(err);
        });
    }
}]);