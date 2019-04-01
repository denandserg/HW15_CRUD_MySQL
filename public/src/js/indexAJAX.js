window.onload = function () {
    form.addEventListener('submit', verify);
    registration.addEventListener('click', () => {window.location.replace("http://localhost:4000/registrationForm.html")});
    registration.setAttribute('disabled', 'true');
    registration.classList.add('disable');
};
const login = document.getElementById('login');
const password = document.getElementById('password');
const inputResponse = document.getElementById('response');
const registration = document.getElementById('registration');
const form =  document.getElementById('form');

function InputForm (login, pass) {
    this.password = pass;
    this.login = login;
}

function verify(event) {
    event.preventDefault();
    const obj = new InputForm(login.value, password.value);
    const request = new XMLHttpRequest();
    request.open("POST", "http://localhost:4000/login", true);
    request.setRequestHeader("Content-Type", "application/json");
    const data = JSON.stringify(obj);
    request.send(data);
    // Это простой способ подготавливить данные для отправки (все браузеры и IE > 9)
    // Функция для наблюдения изменения состояния request.readyState обновления statusMessage соответственно
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status == 200 && request.status < 300) {
                if (request.responseText === 'User not defined, press Registration!') {
                    registration.removeAttribute('disabled');
                    registration.classList.remove('disable');
                } else {
                    registration.setAttribute('disabled', 'true');
                    registration.classList.add('disable');
                    window.location.replace("http://localhost:4000/index.html");
                }
                inputResponse.value = request.responseText;
            }
            else {
                inputResponse.value = 'bad request';
            }
        }
    }
}






