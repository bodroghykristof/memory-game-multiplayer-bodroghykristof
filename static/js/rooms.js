import {data_handler} from "./data_handler.js";

const socket = io.connect('http://127.0.0.1:5000/');

init();

function init() {
    saveUserDataToLocalStorage();
    addCreatingRoomFunctionality();
    addJoiningRoomFunctionality();
    socket.addEventListener('room-creation', displayOtherPlayersNewRoom);
    socket.addEventListener('save_map', saveMap);
    socket.addEventListener('start_game', startNewGame);
}

function saveUserDataToLocalStorage() {
    const infoStorage = document.querySelector('.username-info');
    const username = infoStorage.innerHTML;
    localStorage.setItem('username', username);
    const userId = infoStorage.dataset.userid;
    localStorage.setItem('userid', userId);
}

function addCreatingRoomFunctionality() {
    const createButton = document.querySelector('#create-button');
    createButton.addEventListener('click', createNewRoom)
}

function createNewRoom() {
    const userId = this.dataset.userid;
    const userName = this.dataset.username;
    const userData = {username: userName, user_id: userId}
    data_handler._api_post('/add-room', userData, displayNewRoom)
}


function deleteRoom() {
    const usersRoom = document.querySelector('.create-room .room');
    const roomId = usersRoom.dataset.roomId;
    data_handler._api_delete('/delete-room', roomId, removeRoom);
}

function displayNewRoom(data) {
    const roomNumber = data.room_id;
    const username = localStorage.getItem('username');
    const userid = localStorage.getItem('userid');
    const roomInfo =  JSON.stringify({username: username, roomNumber: roomNumber.toString(), userid: userid})
    socket.emit('create', roomInfo);
    changeButton();
    createNewRoomElement(roomNumber, data.username, '.create-room');
}

function createNewRoomElement(roomNumber, username, selector) {
    let waitingRoom = document.createElement('div');
    waitingRoom.classList.add('room');
    waitingRoom.dataset.roomId = roomNumber;
    waitingRoom.innerHTML = `
        <h4>Room number ${roomNumber}</h4>
        <p><b>Player one:</b> ${username}</p>
        <p>Waiting for another player to join...</p>
    `
    if (selector === '.join-room') {
        waitingRoom.innerHTML += `<button class="join-button">Join</button>`
        waitingRoom.querySelector('button').addEventListener('click', joinRoom);
    }
    document.querySelector(selector).appendChild(waitingRoom);
}

function removeRoom(roomNumber) {
    socket.emit('leave', roomNumber);
    document.querySelector('.create-room .room').remove();
    changeButton();
}

function changeButton() {
    const createButton = document.querySelector('#create-button');
    if (createButton.innerHTML === 'Create New Room') {
        createButton.innerHTML = 'Delete Room';
        createButton.removeEventListener('click', createNewRoom);
        createButton.addEventListener('click', deleteRoom);
    } else {
        createButton.innerHTML = 'Create New Room';
        createButton.removeEventListener('click', deleteRoom);
        createButton.addEventListener('click', createNewRoom);
    }
}




function addJoiningRoomFunctionality() {
    const joinButtons = [...document.querySelectorAll('.join-button')];
    joinButtons.forEach(button => button.addEventListener('click', joinRoom))
}

function joinRoom() {
    const roomNumber = this.closest('.room').dataset.roomId;
    const username = localStorage.getItem('username');
    const userid = localStorage.getItem('userid');
    const roomInfo =  {username: username, roomNumber: roomNumber.toString(), userid: userid}
    socket.emit('join', JSON.stringify(roomInfo));
}

function displayOtherPlayersNewRoom(data) {
    const infoObject = JSON.parse(data)
    const roomNumber = infoObject.roomNumber;
    const username = infoObject.username;
    if (infoObject.userid !== localStorage.getItem('userid')) {
        createNewRoomElement(roomNumber, username, '.join-room');
    }
}

function saveMap(map) {
    localStorage.setItem('map', map);
}

function startNewGame(data) {
    localStorage.setItem('room', data)
    window.location.replace('/game');
}