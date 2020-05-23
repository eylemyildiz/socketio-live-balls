app.controller('indexController',['$scope','indexFactory',($scope, indexFactory)=>{

    //angular da bir array'i html dosyasında nasıl listelenir
    $scope.messages = [{
        text: 'selam',

    },{
        text: 'merhaba',

    }];


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
                socket.emit('newUser', {username})
            }).catch((err) => {
            console.log(err);
        });
    }
}]);