import {data_handler} from "./data_handler.js";

const socket = io.connect('http://127.0.0.1:5000/');
const roomNumber = localStorage.getItem('room');

const classArray = [
    'fa-star',
    'fa-shower',
    'fa-university',
    'fa-car',
    'fa-anchor',
    'fa-bell',
    'fa-bicycle',
    'fa-bullseye',
    'fa-bug',
    'fa-coffee',
    'fa-bolt',
    'fa-cube',
    'fa-diamond',
    'fa-envelope',
    'fa-eye',
    'fa-rss',
    'fa-gift',
    'fa-hashtag'
]

function init() {
    setupConnection();
    createMap();
    createShowingFunctionality();
}

function setupConnection() {
    const info = JSON.stringify({roomNumber: roomNumber})
    socket.emit('create', info);
}

function createMap() {
    let numbers = JSON.parse(localStorage.getItem('map'));
    const gameField = document.querySelector('.game-field');
    let gameTable = document.createElement('table');
    let size = Math.sqrt(numbers.length);
    let tableContent = `<tr>`
    for (let cell = 0; cell < numbers.length; cell++) {
        tableContent += `<td data-solvedclass="${classArray[numbers[cell] - 1]}"><i class="fa fa-question" aria-hidden="true"></i></td>`
        if (cell % size === size - 1 && cell !== size**2 - 1) {
            tableContent += `</tr><tr>`
        }
    }
    tableContent += `</tr>`
    gameTable.innerHTML = tableContent;
    gameField.appendChild(gameTable);
}

function createShowingFunctionality() {
    const cells = [...document.querySelectorAll('td')];
    cells.forEach(cell => cell.addEventListener('click', showIcon))
}

function showIcon() {
    const icon = this.querySelector('i');
    icon.classList.remove('fa-question');
    icon.classList.add(this.dataset.solvedclass);
}

init();
