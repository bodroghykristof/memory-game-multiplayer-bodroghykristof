import {data_handler} from "./data_handler.js";


init();

function init() {
    addCreatingRoomFunctionality();
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

function displayNewRoom(data) {
    changeButton();
    let waitingRoom = document.createElement('div');
    waitingRoom.classList.add('room');
    waitingRoom.innerHTML = `
        <h4>Room number ${data.room_id}</h4>
        <p><b>Player one:</b> ${data.username}</p>
        <p>Waiting for another player to join...</p>
    `
    document.querySelector('.create-room').appendChild(waitingRoom);
}

function changeButton() {
    const createButton = document.querySelector('#create-button');
    createButton.innerHTML = 'Delete room';
    createButton.removeEventListener('click', createNewRoom);
    createButton.addEventListener('click', deleteRoom);
}

function deleteRoom() {
    alert('Success');
}