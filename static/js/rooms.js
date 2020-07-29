init();

function init() {
    addCreatingRoomFunctionality();
}

function addCreatingRoomFunctionality() {
    const createButton = document.querySelector('#create-button');
    createButton.addEventListener('click', createNewRoom)
}

function createNewRoom() {
    alert('Helllo')
}