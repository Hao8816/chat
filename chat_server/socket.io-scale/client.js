/**
 * Client connects to server
 * receives and emits the 'msg' event
 */

var PORT = 8088;
var HOST = 'http://onekoko.com';

var port = parseInt(process.argv[2]) || PORT;

console.log('client connects to port ' + port);

var io = require('socket.io-client');
var socket = io.connect(HOST + ':' + PORT);

socket.on('connect', function () {

    // send message to server
    socket.emit('msg', {'foo': 'bar'});
    console.log('----')
    // wait for messages
    socket.on('msg', function(data) {

        console.log('new message received');
    });
});

socket.on('disconnect', function () {

    // send message to server
    console.log('connection break')

});
