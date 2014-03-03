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