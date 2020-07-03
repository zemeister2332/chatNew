app.controller('indexController', ['$scope','indexFactory', 'configFactory',($scope,indexFactory,configFactory) => {

    $scope.messages = [ ];
    $scope.players = { };

        $scope.init = () => {
        const username = prompt('Iltimos Ismingizni Kiriting !!!');

        if (username)
            initSocket(username);
        else
            return false;
    };

    function scrollTop() {
        setTimeout(() => {
            const el = document.getElementById('chat-area');
            el.scrollTop = el.scrollHeight;
        });
    }

    async function initSocket(username) {
        const connectionOptions = {
            reconnectionAttempts: 3,
            reconnectionDelay: 600
        };


        const socketUrl = await configFactory.getConfig();
        const socket = await indexFactory.connectSocket(socketUrl.data.socketUrl,connectionOptions, {
        }).then((socket) => {
           socket.emit('newUser', { username });

           socket.on('initPlayers', (players) => {
              $scope.players = players;
               scrollTop()
              $scope.$apply();
           });

           socket.on('newUser', (data) => {
               //console.log(data);
               const messageData ={
                   type: {
                       code: 0, // server or user message
                       message: 1 // login or disconnect
                   }, // info
                   username: data.username
               };
               $scope.messages.push(messageData);
               $scope.players[data.id] = data;
               scrollTop()
               $scope.$apply();
           });

           socket.on('disUser', (data) => {
               const messageData ={
                   type: {
                       code: 0, // server or user message
                       message: 0 // login or disconnect
                   }, // info
                   username: data.username
               };
               $scope.messages.push(messageData);
               delete $scope.players[data.id];
               scrollTop()
               $scope.$apply();
           });

           socket.on('animate', data => {
               //console.log(data)
               $('#'+data.socketId).animate({'left': data.x, 'top': data.y}, () => {
                   animate = false;
               });
           });

           socket.on('newMessage', message => {
               $scope.messages.push(message);
               $scope.$apply();
               scrollTop();
           });

            let animate = false;
           $scope.onClickPlayer = ($event) => {
             //console.log($event.offsetX, $event.offsetY);
            if  (!animate){
                let x = $event.offsetX
                let y = $event.offsetY

                socket.emit('animate', {x, y});

                animate = true;
                $('#'+socket.id).animate({'left': x, 'top': y}, () => {
                    animate = false;
                });
                
            }
           };

           $scope.newMessage = () => {
               let message = $scope.message;
               const messageData ={
                   type: {
                       code: 1, // server or user message
                   },
                   username: username,
                   text: message
               };
               $scope.messages.push(messageData);
               $scope.message = '';

               socket.emit('newMessage', messageData);

               scrollTop();

           };

        }).catch((err) => {
            console.log(err);
        });
    }
}]);