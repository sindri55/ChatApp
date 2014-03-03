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