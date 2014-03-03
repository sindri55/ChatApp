app.controller("RoomController", ["$scope", "$routeParams", "$location", "SocketService", 
	function($scope, $routeParams, $location, SocketService) {
	$scope.roomName = $routeParams.roomName;
	$scope.currentMessage = "";
	$scope.op = $routeParams.ops;
	var socket = SocketService.getSocket();
/**
 * Room.js is with the basic functions conntected to each chatroom. 
 * -Updatechat sees that chat in history come back when room is visit again.
 * -Updateuser sees that user in each room are there when visited
 * -socket.emit joinroom send to the server roomname
 * -kicked sees that when op kicks a user out, that the user is directed to menu 
 * page. There is a FAIL in that implementation becouse user doesn´t get kicked until 
 * user starts to write or klicks on the screen. $scope.apply() didn´t help.
 * -scope.send sends the message to chatserver. But if the string has a /kick as a first
 * word, then it will get the second word from the strings which is the user that will
 * be kicked. 
 * - KeyPress if 'enter' is clicked then message will be display to others
 */
	if(socket) {
		console.log("");
		socket.emit("joinroom", { room: $scope.roomName, pass: "" }, function(success, errorMessage) {});

		socket.on("updatechat", function(roomName, messageHistory) {
			console.log(messageHistory);
			$scope.messages = messageHistory;
			$scope.$apply();
		});

		socket.on("updateusers", function(room, users) {
			if(room === $scope.roomName) {
			$scope.users = users;
			}
		});

		socket.on("kicked", function(room, user, username){
			console.log(user + " just got kicked out!");
			if (SocketService.getUsername() === user){
				$location.path("/menu");	
				//$scope.apply();	
			}			
		});
	}

	$scope.send = function() {
		if(socket) {
			var mes = $scope.currentMessage.split(" ");
			if(mes[0] === "/kick"){
				var kickeduser = mes[1];
				console.log("the kicked user is: " + kickeduser + " and the room is: " + $scope.roomName);
				socket.emit("kick", {user: kickeduser, room: $scope.roomName }, function(success, errorMessage) {
				});
			}
			else{
				console.log("I sent a message to " + $scope.roomName + ": " + $scope.currentMessage);
				socket.emit("sendmsg", { roomName: $scope.roomName, msg: $scope.currentMessage });
				$scope.currentMessage = "";
			}
		}
	};

	$scope.keyPress = function($event) {
		if($event.keyCode === 13) {
			$scope.send();
		}
	};
}]);