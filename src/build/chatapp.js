app.controller("LoginController", ["$scope", "$location", "SocketService", function($scope, $location, SocketService) {
	$scope.username = "";
	$scope.message = "";
	var socket = io.connect('http://localhost:8080');
/**
 * Loginjs only login a new user.
 * -Connection function to connect a new user to the program, if the name is taken then 
 * user have to pick an other name. User is directed to menu room where user
 * can pic rooms or create one.
 */
	$scope.connect = function() {
		if(socket) {
			socket.emit("adduser", $scope.username, function(available) {
				if(available) {
					SocketService.setConnected(socket);
					SocketService.setUsername($scope.username);
					$location.path("/menu");
				}
				else {
					$scope.message = "Your name is taken, please choose another";
				}
				$scope.$apply();
			});
		}
	};
}]);
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
var app = angular.module("ChatApp", ["ngRoute"]);
app.config(["$routeProvider", function($routeProvider) {
	$routeProvider.when("/", {
		templateUrl: "templates/home.html",
		controller: "LoginController",
	}).when("/room/:roomName", {
		templateUrl: "templates/room.html",
		controller: "RoomController",
	}).when("/menu", {
		templateUrl: "templates/menu.html",
		controller: "MenuController",
	}).otherwise({ redirectTo: "/" });
}]);
app.factory("SocketService", ["$http", function($http) {
	var username = "";
	var socket;
	var room = "";
	return {
		setConnected: function(theSocket) {
			socket = theSocket;
		},
		setUsername: function(user) {
			username = user;
		},
		getUsername: function() {
			return username;
		},
		getSocket: function() {
			return socket;
		},





		setRoom: function(newroom){
			room = newroom;
		}


	};
}]);