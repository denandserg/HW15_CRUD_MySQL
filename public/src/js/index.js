"use strict";
window.onload = () => {
    requestServerToPerson();
    requestServerToData();
    setTimeout(valueOnInput, 500);
};

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const login = document.querySelector('#login');
const password = document.querySelector('#pass');
const mail = document.querySelector('#mail');
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

function requestServerToPerson () {
    const request = new XMLHttpRequest();
    request.open("GET", "http://localhost:4000/currentUser", true);
    request.send();
    // Это простой способ подготавливить данные для отправки (все браузеры и IE > 9)
    // Функция для наблюдения изменения состояния request.readyState обновления statusMessage соответственно
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200 && request.status < 300) {
              let arrResponse = JSON.parse(request.response);
                userName.innerHTML = `Hello, dear ${arrResponse[0]}!`;
            }
        }
    }
}

function requestServerToData () {
    const request = new XMLHttpRequest();
    request.open("GET", "http://localhost:4000/currentData", true);
    request.send();
    // Это простой способ подготавливить данные для отправки (все браузеры и IE > 9)
    // Функция для наблюдения изменения состояния request.readyState обновления statusMessage соответственно
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200 && request.status < 300) {
                let arrData;
                try {
                    arrData = JSON.parse(request.response);
                } catch {
                    console.log('wrong json');
                }

                for (let i = 0; i <arrData.length; i++) {
                    const curRow = document.createElement('div');
                    curRow.classList.add('row');
                    curRow.innerHTML = `<div class="col-2">${arrData[i].personID}</div><div class="col-4">${arrData[i].login}</div><div class="col-4">${arrData[i].password}</div>
                         <div class="col-4">${arrData[i].mail}</div><div class="col-4">${arrData[i].firstName}</div><div class="col-4">${arrData[i].lastName}</div><div class="col-2">${arrData[i].age}</div>`;
                    tableBody.appendChild(curRow);
                }
            }
        }
    }
}
                                             //  MODEL
function checkMail() {

}

function saveToLS () {
    const isoTable = JSON.stringify(tableBody.innerHTML);
  renderMsg(`Data was saved to LocalStorage.`);
  localStorage.setItem('1', isoTable);
  console.log(isoTable);
}

function clearLS() {
  localStorage.clear();
  renderMsg(`LocalStorage was cleared.`);
}

// VIEW

function renderMsg(msg) {

  if (msg) {
    msgBox.innerText = msg;
  } else {
    msgBox.innerText = '';
  }
}

function InputForm (login, pass, mail, firstname, lastname, age) {
    this.login = login;
    this.password = pass;
    this.mail = mail;
    this.firstName = firstname;
    this.lastName = lastname;
    this.age = age || null;
}

function addPersonDataDB () {
    const request = new XMLHttpRequest();
    const obj = new InputForm(login.value, password.value, mail.value, fName.value, lName.value, age.value);
    request.open("POST", "http://localhost:4000/createData", true);
    request.setRequestHeader("Content-Type", "application/json");
    console.log(obj);
    const data = JSON.stringify(obj);
    request.send(data);
    tableBody.innerHTML = '';
    setTimeout(requestServerToData, 500);
    setTimeout(valueOnInput, 1000);
}

function deleteRowPersonDB () {
    const request = new XMLHttpRequest();
    const obj = new InputForm(login.value, password.value, mail.value, fName.value, lName.value, age.value);
    request.open("POST", "http://localhost:4000/deleteRow", true);
    request.setRequestHeader("Content-Type", "application/json");
    console.log(obj);
    const data = JSON.stringify(obj);
    request.send(data);
    tableBody.innerHTML = '';
    setTimeout(requestServerToData, 500);
    setTimeout(valueOnInput, 1000);
}

function updatePersonDB () {
    const updObj = new InputForm(login.value, password.value, mail.value, fName.value, lName.value, age.value);
    const request = new XMLHttpRequest();
    request.open("POST", "http://localhost:4000/updateRow", true);
    request.setRequestHeader("Content-Type", "application/json");
    console.log(updObj);
    const data = JSON.stringify(updObj);
    request.send(data);
    tableBody.innerHTML = '';
    setTimeout(requestServerToData, 500);
    setTimeout(valueOnInput, 1000);
}

function valueOnInput () {
    const rowTableBody = tableBody.childNodes;
    for (let i =0; i < rowTableBody.length; i++) {
        rowTableBody[i].addEventListener('click', setValueInInput.bind(rowTableBody[i]));
    }
    function setValueInInput () {
        const divRowTableBody = this.childNodes;
        console.log(divRowTableBody);
        login.value = divRowTableBody[1].innerHTML;
        password.value =divRowTableBody[2].innerHTML;
        mail.value =divRowTableBody[4].innerHTML;
        fName.value =divRowTableBody[5].innerHTML;
        lName.value =divRowTableBody[6].innerHTML;
        age.value =divRowTableBody[7].innerHTML;
    }
}

// CONTROLLER

clearBtn.addEventListener('click', clearLS);
saveBtn.addEventListener('click', saveToLS);

deleteBtn.addEventListener('click', deleteRowPersonDB);
createBtn.addEventListener('click', addPersonDataDB);
updateBtn.addEventListener('click', updatePersonDB);
