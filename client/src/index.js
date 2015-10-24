import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import io from 'socket.io-client';
let messages = [];
function start () {
    ReactDOM.render(<App />, document.getElementById('root'));
}

var socket = io.connect('http://localhost:3030');
socket.on('event', function(data) {
    console.log(data);
    if (typeof data !== 'string') {
        return;
    }
    console.log(JSON.parse(data));
});
start();
