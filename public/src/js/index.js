"use strict";
window.onload = () => {
    requestServerToPerson();
    requestServerToData();
    setTimeout(valueOnInput, 500);
    logout.addEventListener('click', () => {
        fetch('http://localhost:4000/clearCurName', {method: 'GET'});
        window.location.replace("http://localhost:4000/loginForm.html")
    });
};

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const id = document.getElementById('id');
const fName = document.querySelector('#fname');
const lName = document.querySelector('#lname');
const age = document.querySelector('#age');
const tableBody = document.querySelector('#tableBody');
const saveBtn = document.querySelector('#saveBtn');
const clearBtn = document.querySelector('#clearBtn');
const userName = document.querySelector('#userName');
const createBtn = document.querySelector('#createBtn');
const updateBtn = document.querySelector('#updateBtn');
const deleteBtn = document.querySelector('#deleteBtn');
const logout = document.querySelector('#logout');

function requestServerToPerson () {
    fetch('http://localhost:4000/currentUser', {method: 'GET'})
        .then(response => response.json())
        .then(function (arr) {
            if (arr[0] !== void 0) {
                userName.innerHTML = `Hello, ${arr[0]}!`;
            } else {
                userName.innerHTML = `Guest account!`;
            }
            })
        .catch(alert);
}

function requestServerToData () {
    fetch('http://localhost:4000/currentData', {method: 'GET'})
        .then(response => response.json())
        .then(function (arrData) {
            for (let i = 0; i <arrData.length; i++) {
                const curRow = document.createElement('div');
                curRow.classList.add('row');
                curRow.innerHTML = `<div class="col-2">${arrData[i].personID}</div><div class="col-4">${arrData[i].firstName}</div><div class="col-4">${arrData[i].lastName}</div><div class="col-2">${arrData[i].age}</div>`;
                tableBody.appendChild(curRow);
            }
        })
        .catch(alert);
}
                                             //  MODEL
function saveToLS () {
    unHideMsg ();
    const isoTable = JSON.stringify(tableBody.innerHTML);
    renderMsg(`Data was saved to LocalStorage.`, 'green');
    localStorage.setItem('1', isoTable);
}

function unHideMsg () {
    msgBox.style.visibility = "visible";
}
function hideMsg () {
    msgBox.style.visibility = "hidden";
}

function clearLS() {
  localStorage.clear();
  renderMsg(`LocalStorage was cleared.`, 'green');
}

// VIEW

let timeoutID = null;
function renderMsg(msg, color) {
    msgBox.style.color = color;
    if (msg) {
        msgBox.innerText = msg;
    } else {
        msgBox.innerText = '';
    }
    unHideMsg();
    if (timeoutID !== null) {
        clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(hideMsg ,3000);
}

class InputForm {
    constructor (id, firstname, lastname, age) {
        this.id = id;
        this.firstName = firstname;
        this.lastName = lastname;
        this.age = age || null;
    }
}

function checkID () {
    const rowTableBody = tableBody.childNodes;
    for(let divCurID of rowTableBody) {
        if(divCurID.nodeType === 3) {
            continue;
        }
        if(divCurID.firstChild.innerHTML === id.value) {
            return false;
        }
    }
    return true;
}

function createPersonAJAX() {
    fetch('http://localhost:4000/createData', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(new InputForm(id.value, fName.value, lName.value, age.value))
    })
        .catch(alert);
}

function addPersonDataDB () {
    if (fName.value === "" ||
        id.value === "" ||
        lName.value === "" ||
        age.value === "") {
        return renderMsg('Fill in all the fields', 'red');
    } else {
        if(checkID()) {
            createPersonAJAX();
            tableBody.innerHTML = '';
            renderMsg(`Data add`, 'green');
            setTimeout(requestServerToData, 500);
            setTimeout(valueOnInput, 1000);
        } else {
            return renderMsg('User with input ID already added', 'red');
        }
    }
}

function deletePersonAJAX() {
    fetch('http://localhost:4000/deleteRow', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(new InputForm(id.value, fName.value, lName.value, age.value))
    })
        .catch(alert);
}

function updatePersonAJAX() {
    fetch('http://localhost:4000/updateRow', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(new InputForm(id.value, fName.value, lName.value, age.value))
    })
        .catch(alert);
}

function deleteRowPersonDB () {
    if (id.value === "") {
        return renderMsg('Fill in all the fields', 'red');
    } else {
        if (!checkID()) {
            deletePersonAJAX();
            tableBody.innerHTML = '';
            renderMsg(`Data deleted`, 'green');
            setTimeout(requestServerToData, 500);
            setTimeout(valueOnInput, 1000);
        } else {
            renderMsg(`ID not found!!!`, 'red');
        }
    }
}

function updatePersonDB () {
    if (id.value === "" ||
        fName.value === "" ||
        lName.value === "" ||
        age.value === "") {
        return renderMsg('Fill in login, password and mail', 'red')
    } else {
        if(!checkID()) {
            updatePersonAJAX();
            tableBody.innerHTML = '';
            renderMsg(`Data updated`, 'green');
            setTimeout(requestServerToData, 500);
            setTimeout(valueOnInput, 1000);
        } else {
            renderMsg(`ID not found!!!`, 'red');
        }

    }
}

function valueOnInput () {
    const rowTableBody = tableBody.childNodes;
    for (let row of rowTableBody) {
        row.addEventListener('click', setValueInInput);
    }
    function setValueInInput () {
        const divRowTableBody = this.childNodes;
        id.value = divRowTableBody[0].innerHTML;
        fName.value =divRowTableBody[1].innerHTML;
        lName.value =divRowTableBody[2].innerHTML;
        age.value =divRowTableBody[3].innerHTML;
    }
}

// CONTROLLER

clearBtn.addEventListener('click', clearLS);
saveBtn.addEventListener('click', saveToLS);

deleteBtn.addEventListener('click', deleteRowPersonDB);
createBtn.addEventListener('click', addPersonDataDB);
updateBtn.addEventListener('click', updatePersonDB);
