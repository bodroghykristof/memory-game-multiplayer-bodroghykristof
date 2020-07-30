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
    initVariables();
    createMap();
    findOutStarterPlayer();
}

function setupConnection() {
    const info = JSON.stringify({roomNumber: roomNumber})
    socket.emit('game-join', info);
}

function initVariables() {
    localStorage.setItem('rounds', '0');
}

function createMap() {
    let numbers = JSON.parse(localStorage.getItem('map'));
    const gameField = document.querySelector('.game-field');
    let gameTable = document.createElement('table');
    let size = Math.sqrt(numbers.length);
    let tableContent = `<tr>`
    for (let cell = 0; cell < numbers.length; cell++) {
        tableContent += `<td data-solvedclass="${classArray[numbers[cell] - 1]}" id="cell-${cell}"><i class="fa fa-question" aria-hidden="true"></i></td>`
        if (cell % size === size - 1 && cell !== size**2 - 1) {
            tableContent += `</tr><tr>`
        }
    }
    tableContent += `</tr>`
    gameTable.innerHTML = tableContent;
    gameField.appendChild(gameTable);
}

function findOutStarterPlayer() {
    const roomNumber = localStorage.getItem('room')
    data_handler._api_get(`starter/${roomNumber}`, addShowingFunctionality)
}

function addShowingFunctionality(data) {
    console.log(data)
    console.log(localStorage.getItem('userid'))
    if (data.toString() === localStorage.getItem('userid')) {
        const cells = [...document.querySelectorAll('td')];
        cells.forEach(cell => cell.addEventListener('click', showIcon))
    }
}

function removeShowingFunctionality() {
    const cells = [...document.querySelectorAll('td')];
    cells.forEach(cell => cell.removeEventListener('click', showIcon))
}

function showIcon() {
    localStorage.setItem('rounds', (parseInt(localStorage.getItem('rounds')) + 1).toString())
    localStorage.setItem(`guess-${parseInt(localStorage.getItem('rounds')) % 2}`, this.id.split('-')[1])
    const icon = this.querySelector('i');
    icon.classList.remove('fa-question');
    icon.classList.add(this.dataset.solvedclass);

    if (parseInt(localStorage.getItem('rounds')) % 2 === 0) {
        removeShowingFunctionality()
        const guessOne = document.querySelector(`#cell-${localStorage.getItem('guess-0')}`)
        const guessTwo = document.querySelector(`#cell-${localStorage.getItem('guess-1')}`)
        if (guessOne.querySelector('i').classList[1] !== guessTwo.querySelector('i').classList[1]) {
            setTimeout(function () {
                hideIcon(guessOne);
                hideIcon(guessTwo);
            }, 2000);
        }
    }
}


function hideIcon(cell) {
    const icon = cell.querySelector('i');
    icon.classList.remove(cell.dataset.solvedclass);
    icon.classList.add('fa-question');
}


init();
