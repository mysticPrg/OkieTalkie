define(['G2NNetwork'], function (G2NNetwork) {
	var exports = {};
	
	var ip = '210.118.74.165';
	var port = '33334';
	
	var room_length = 0;
	var room_port = 0;
	var room_addr = null;
	var room_socket = null;
	
	var room_recv_port;
	var room_recv_length;
	
	var addr = null;
	var socket = null;
	
	var onMessageKey = null;
	var onRoomMessageKey = null;
	
	var id = null;
	var channels = null;
	
	var closeCallback,
		initCallback,
		joinCallback,
		exitCallback,
		requestMicCallback;
	
	function onMessage(msg) {
		var json = JSON.parse(msg);
		
		console.log(msg);
		
		switch ( json.type ) {
		case 'init':
			id = json.id;
			channels = json.channels;
			
			initCallback(json.channels, json.allLength);
			break;
			
		case 'join':
			room_length = json.length;
			room_port = json.port;
			room_addr = new G2NNetwork.Socket.Address(ip, room_port, function() {
				room_socket = new G2NNetwork.Socket(room_addr, G2NNetwork.Socket.Protocol.UDP, function() {
					room_socket.addReceiveMessageListener (onMessage, function(key) {
						onRoomMessageKey = key;
						
						room_socket.openAndListen(function() {
							room_recv_length = json.length;
							room_recv_port = json.port;
							
							room_socket.sendMessage(JSON.stringify({
								type: 'check',
								id: id
							}));
						});
					});
				});
			});
			break;
			
		case 'check':
			joinCallback(room_recv_length, room_recv_port);
			break;
			
		case 'exit':
			room_socket.close(function() {
				exitCallback(json.channels, json.allLength);
			});
			break;
			
		case 'close':
			socket.close(function() {
				closeCallback();
			});
			break;
			
		case 'requestMic':
			var result = false;
			if ( json.id === id )
				result = true;
			requestMicCallback(result);
			break;
			
		case 'releaseMic':
			break;
			
		case 'send':
			break;
		}
	}
	
	exports.connect = function(callback) {
		addr = new G2NNetwork.Socket.Address(ip, port, function() {
			socket = new G2NNetwork.Socket(addr, G2NNetwork.Socket.Protocol.UDP, function() {
				socket.addReceiveMessageListener (onMessage, function(key) {
					onMessageKey = key;
					
					socket.openAndListen(function() {
						initCallback = callback;
						exports.sendInit();
					});
				});
			});
		});
	};
	
	exports.sendInit = function() {
		socket.sendMessage(JSON.stringify({type: 'init'}));
	};
	
	exports.sendJoin = function(channel, callback) {
		socket.sendMessage(JSON.stringify({
			type: 'join',
			id: id,
			channel: channel
		}));
		joinCallback = callback;
	};
	
	exports.sendExit = function(channel, callback) {
		socket.sendMessage(JSON.stringify({
			type: 'exit',
			id: id,
			channel: channel
		}));
		exitCallback = callback;
	};
	
	exports.sendClose = function(callback) {
		socket.sendMessage(JSON.stringify({
			type: 'close',
			id: id
		}));
		closeCallback = callback;
	};
	
	exports.sendRequestMic = function(callback) {
		room_socket.sendMessage(JSON.stringify({
			type: 'requestMic',
			id: id
		}));
		
		requestMicCallback = callback;
	};
	
	exports.sendReleaseMic = function() {
		socket.sendMessage(JSON.stringify({
			type: 'releaseMic',
			id: id
		}));
	};
	
	exports.sendData = function(data) {
		
	};
	
	return exports;
});