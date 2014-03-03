app.controller("MenuController", ["$scope", "$location", "SocketService", 
	function ($scope, $location, SocketService) {
	$scope.temprooms = [];
	var socket = SocketService.getSocket();
/**
 * Menu.js has only two function and they are to display excisting room 
 * and to create new room. 
 * -CreateRoom creates a new room
 * -socket.emit rooms iterate threw all rooms in "db" and buts into temprooms[]
 */
	if(socket){	
		socket.emit("rooms", function(success, errorMessage){});
		socket.on('roomlist', function(rooms){
			for(var room in rooms){
				$scope.temprooms.push(room);
				console.log(room);
			}
			$scope.$apply();
		});
    }
    

	$scope.createRoom = function() {
		if(socket){
			socket.emit("joinroom", $scope.roomName, function(available){
				SocketService.setRoom($scope.roomName);
				console.log($scope.roomName + " got created");
				$location.path("/room/"+ $scope.roomName);
				$scope.$apply();
			});
			
		}
	};
}]);