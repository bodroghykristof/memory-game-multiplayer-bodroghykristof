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
    'fa-bug']
//
//     'fa-coffee',
//     'fa-bolt',
//     'fa-cube',
//     'fa-diamond',
//     'fa-envelope',
//     'fa-eye',
//     'fa-rss',
//     'fa-gift',
//     'fa-hashtag'
// ]

function init() {
    setupConnection();
    initVariables();
    initScoreBoard();
    createMap();
    findOutStarterPlayer();
    socket.addEventListener('first-guess', showOthersFirstIcon)
    socket.addEventListener('second-guess', endOthersRound)
    window.addEventListener('win', endGame)
}

function setupConnection() {
    const info = JSON.stringify({roomNumber: roomNumber})
    socket.emit('game-join', info);
}

function initVariables() {
    localStorage.setItem('rounds', '0');
}

function initScoreBoard() {
    document.querySelector('#player-one-name').innerHTML = localStorage.getItem('username')
    document.querySelector('#player-two-name').innerHTML = localStorage.getItem('opponent')
}

function createMap() {
    let numbers = JSON.parse(localStorage.getItem('map'));
    const gameField = document.querySelector('.game-field');
    let gameTable = document.createElement('table');
    let size = Math.sqrt(numbers.length);
    let tableContent = `<tr>`
    for (let cell = 0; cell < numbers.length; cell++) {
        tableContent += `<td data-solvedclass="${classArray[numbers[cell] - 1]}" id="cell-${cell}" class="active"><i class="fa fa-question" aria-hidden="true"></i></td>`
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
    data_handler._api_get(`starter/${roomNumber}`, startGame)
}

function startGame(data) {
    if (data.toString() === localStorage.getItem('userid')) {
        localStorage.setItem('starter', 'yes');
        addShowingFunctionality()
    } else {
        localStorage.setItem('starter', 'no');
    }
}

function addShowingFunctionality() {
    const cells = [...document.querySelectorAll('.active')];
    cells.forEach(cell => cell.addEventListener('click', showIcon))
}

function removeShowingFunctionality() {
    const cells = [...document.querySelectorAll('.active')];
    cells.forEach(cell => cell.removeEventListener('click', showIcon))
}

function showIcon() {
    localStorage.setItem('rounds', (parseInt(localStorage.getItem('rounds')) + 1).toString())
    localStorage.setItem(`guess-${parseInt(localStorage.getItem('rounds')) % 2}`, this.id.split('-')[1])
    const icon = this.querySelector('i');
    icon.classList.remove('fa-question');
    icon.classList.add(this.dataset.solvedclass);
    let dataToServer = JSON.stringify({roomNumber: localStorage.getItem('room').toString(), cellNumber: this.id.split('-')[1].toString()})

    if (parseInt(localStorage.getItem('rounds')) % 2 === 0) {
        socket.emit('second-guess', dataToServer)
        removeShowingFunctionality()
        const guessOne = document.querySelector(`#cell-${localStorage.getItem('guess-0')}`)
        const guessTwo = document.querySelector(`#cell-${localStorage.getItem('guess-1')}`)
        setTimeout(function () {
            if (guessOne.querySelector('i').classList[1] !== guessTwo.querySelector('i').classList[1]) {
                hideIcon(guessOne);
                hideIcon(guessTwo);
            } else {
                guessOne.classList.remove('active')
                guessTwo.classList.remove('active')
                guessOne.classList.add('inactive')
                guessTwo.classList.add('inactive')
                let currentScore = document.querySelector(' #player-one-score').innerHTML;
                document.querySelector(' #player-one-score').innerHTML = (parseInt(currentScore) + 1).toString();
                checkForEndGame();
            }
        }, 2000)
    } else {
        this.removeEventListener('click', showIcon)
        socket.emit('first-guess', dataToServer)
    }
}

function showOthersFirstIcon(data) {
    const icon = document.querySelector(`#cell-${data} i`);
    icon.classList.remove('fa-question');
    icon.classList.add(icon.closest('td').dataset.solvedclass);
    localStorage.setItem('opponent-guess', data);
}

function endOthersRound(data) {
    const guessOne = document.querySelector(`#cell-${localStorage.getItem('opponent-guess')} i`);
    const guessTwo = document.querySelector(`#cell-${data} i`);
    guessTwo.classList.remove('fa-question');
    guessTwo.classList.add(guessTwo.closest('td').dataset.solvedclass);
    setTimeout(function () {
        if (guessOne.classList[1] !== guessTwo.classList[1]) {
            hideIcon(guessOne.closest('td'));
            hideIcon(guessTwo.closest('td'))
        } else {
            guessOne.closest('td').classList.remove('active');
            guessTwo.closest('td').classList.remove('active');
            guessOne.closest('td').classList.add('inactive');
            guessTwo.closest('td').classList.add('inactive');
            let currentScore = document.querySelector(' #player-two-score').innerHTML;
            document.querySelector(' #player-two-score').innerHTML = (parseInt(currentScore) + 1).toString();
            checkForEndGame();
        }
        addShowingFunctionality();
    }, 2000);
}

function checkForEndGame() {
    const activeCells = document.querySelectorAll('.active');
    if (activeCells.length === 0) {
        let winEvent = new CustomEvent('win', {bubbles: true, cancelable: true});
        window.dispatchEvent(winEvent);
    }
}

function hideIcon(cell) {
    const icon = cell.querySelector('i');
    icon.classList.remove(cell.dataset.solvedclass);
    icon.classList.add('fa-question');
}

function endGame() {
    const ownScore = parseInt(document.querySelector('#player-one-score').innerHTML);
    const opponentScore = parseInt(document.querySelector('#player-two-score').innerHTML);
    if (opponentScore < ownScore) {
        $('#winModal').modal()
    } else if (ownScore < opponentScore) {
        $('#winModal').modal()
    } else {
        $('#winModal').modal()
    }
}


init();
