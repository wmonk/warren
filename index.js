var app = require('express')();
app.set('view engine', 'hbs');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var socket;

var amqp = require('amqp');
var connection = amqp.createConnection();

connection.on('ready', function () {
    console.log('ready');

    connection.queue('my-queue', function (q) {
        // Catch all messages
        q.bind('#');

        // Receive messages
        q.subscribe(function (message, headers, deliveryInfo, messageObject) {
            console.log('Got a message with routing key ' + deliveryInfo.routingKey);
            socket && socket.emit('event', {
                message: message.data.toString(),
                headers: headers,
                deliveryInfo: deliveryInfo
            });
        });
    });
});

connection.on('error', function (err) {
    console.log(err);
});

app.get('/', function (req, res, next) {
    res.render('index');
});

io.on('connection', function (innerSocket) {
    socket = innerSocket;
    socket.emit('event', { hello: 'world' });
});

server.listen(3030)
