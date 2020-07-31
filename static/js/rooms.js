import {data_handler} from "./data_handler.js";

const socket = io.connect('http://127.0.0.1:5000/');

init();

function init() {
    saveUserDataToLocalStorage();
    getCurrentRoomIfExists();
    addCreatingRoomFunctionality();
    addJoiningRoomFunctionality();
    socket.addEventListener('room-creation', displayOtherPlayersNewRoom);
    socket.addEventListener('remove-room', removeOtherPlayersRoom);
    socket.addEventListener('save_map', saveMap);
    socket.addEventListener('set_opponent', setOpponent);
    socket.addEventListener('close_room', closeRoomWhenGameStarts);
    socket.addEventListener('start_game', startNewGame);
}

function saveUserDataToLocalStorage() {
    const infoStorage = document.querySelector('.username-info');
    const username = infoStorage.innerHTML;
    localStorage.setItem('username', username);
    const userId = infoStorage.dataset.userid;
    localStorage.setItem('userid', userId);
}

function getCurrentRoomIfExists() {
    const userId = localStorage.getItem('userid')
    data_handler._api_get(`/current-room/${userId}`, joinToCurrentRoom)
}

function joinToCurrentRoom(data) {
    if (data !== 'No room') {
        socket.emit('game-join', JSON.stringify({roomNumber: data.toString()}))
    }
}

function addCreatingRoomFunctionality() {
    const createButton = document.querySelector('#create-button');
    switch (createButton.innerHTML) {
        case 'Create New Room':
            createButton.addEventListener('click', createNewRoom)
        default:
            createButton.addEventListener('click', deleteRoom)
    }
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
        <p><b>Player one:</b> <span>${username}</span></p>
        <p class="wait-paragraph">Waiting for another player to join...</p>
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
    const opponentName = this.closest('.room').querySelector('p span').innerHTML;
    localStorage.setItem('opponent', opponentName);
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

function removeOtherPlayersRoom(roomNumber) {
    const rooms = document.querySelectorAll('.room');
    for (let room of rooms) {
        if (room.dataset.roomId === roomNumber) {
            room.remove();
        }
    }
}

function saveMap(map) {
    localStorage.setItem('map', map);
}

function setOpponent(opponentInfo) {
    const userId = JSON.parse(opponentInfo).userid.toString();
    if (userId !== localStorage.getItem('userid')) {
        localStorage.setItem('opponent', JSON.parse(opponentInfo).username)
    }
}

function closeRoomWhenGameStarts(data) {
    console.log(data)
    const information = JSON.parse(data);
    const roomNumber = information.roomNumber;
    const username = information.usernameTwo;
    console.log(roomNumber)
    console.log(username)
    const openRooms = document.querySelectorAll('.join-room .room');
    for (let room of openRooms) {
        if (room.dataset.roomId === roomNumber) {
            document.querySelector('.spectate-room').appendChild(room);
            room.querySelector('.wait-paragraph').innerHTML = `<b>Player two:</b> <span>${username}</span>`;
            room.querySelector('button').innerHTML = `Spectate`;
        }
    }
}

function startNewGame(data) {
    localStorage.setItem('room', data)
    window.location.replace('/game');
}