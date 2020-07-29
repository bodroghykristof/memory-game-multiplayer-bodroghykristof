import {data_handler} from "./data_handler.js";

const socket = io.connect('http://127.0.0.1:5000/');
socket.emit('create', localStorage.getItem('room'))
socket.addEventListener('message', alertData)

let button = document.querySelector('button')
button.addEventListener('click', function () {
    let data = JSON.stringify({data: 'Hello', room: localStorage.getItem('room')})
    socket.emit('message', data)
})

function alertData(data) {
    console.log(data)
}