import {data_handler} from "./data_handler.js";

const socket = io.connect('http://127.0.0.1:5000/');
const roomNumber = localStorage.getItem('room');

function init() {
    setupConnection();
    createMap();
}

function setupConnection() {
    socket.emit('create', roomNumber);
}

function createMap() {
    let numbers = JSON.parse(localStorage.getItem('map'));
    const gameField = document.querySelector('.game-field');
    let gameTable = document.createElement('table');
    let tableContent = `<tr>`
    for (let cell = 0; cell < numbers.length; cell++) {
        tableContent += `<td>${numbers[cell]}</td>`
        if (cell % 10 === 9 && cell !== 99) {
            tableContent += `</tr><tr>`
        }
    }
    tableContent += `</tr>`
    gameTable.innerHTML = tableContent;
    gameField.appendChild(gameTable);
}


init();



// socket.addEventListener('message', alertData)
//
// let button = document.querySelector('button')
// button.addEventListener('click', function () {
//     let data = JSON.stringify({data: 'Hello', room: localStorage.getItem('room')})
//     socket.emit('message', data)
// })
//
// function alertData(data) {
//     console.log(data)
// }
