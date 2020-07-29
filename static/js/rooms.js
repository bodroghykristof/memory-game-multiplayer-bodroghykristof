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

function displayNewRoom() {
    console.log('Semi-success')
}