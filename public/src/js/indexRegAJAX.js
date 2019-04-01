window.onload = function () {
    form.addEventListener('submit', verify);
    // registration.addEventListener('click', () => {window.location.replace("http://localhost:4000/clientList.html")});
};
const login = document.getElementById('login');
const password = document.getElementById('password');
const mail = document.getElementById('mail');
const form =  document.getElementById('form');
const registration = document.getElementById('registration');

function InputForm (login, pass, mail) {
    this.password = pass;
    this.login = login;
    this.mail = mail;
}

function verify(event) {
    event.preventDefault();
    const obj = new InputForm(login.value, password.value, mail.value);
    const request = new XMLHttpRequest();
    request.open("POST", "http://localhost:4000/register", true);
    request.setRequestHeader("Content-Type", "application/json");
    const data = JSON.stringify(obj);
    request.send(data);
    // Это простой способ подготавливить данные для отправки (все браузеры и IE > 9)
    // Функция для наблюдения изменения состояния request.readyState обновления statusMessage соответственно
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status == 200 && request.status < 300) {
                if (request.responseText === 'users allready add') {
                    alert("bad");
                } else {
                    window.location.replace("http://localhost:4000/index.html");
                }
            }
        }
    }
}






