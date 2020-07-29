import {data_handler} from "./data_handler.js";

const socket = io.connect('http://127.0.0.1:5000/');


init();

function init() {
    saveUserDataToLocalStorage();
    addCreatingRoomFunctionality();
    addJoiningRoomFunctionality();
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
    socket.emit('create', roomNumber);
    changeButton();
    let waitingRoom = document.createElement('div');
    waitingRoom.classList.add('room');
    waitingRoom.dataset.roomId = roomNumber;
    waitingRoom.innerHTML = `
        <h4>Room number ${roomNumber}</h4>
        <p><b>Player one:</b> ${data.username}</p>
        <p>Waiting for another player to join...</p>
    `
    document.querySelector('.create-room').appendChild(waitingRoom);
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
    const roomInfo =  {username: username, roomNumber: roomNumber, userid: userid}
    socket.emit('join', JSON.stringify(roomInfo));
}
