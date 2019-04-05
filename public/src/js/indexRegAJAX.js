window.onload = function () {
    form.addEventListener('submit', verify);
};
const login = document.getElementById('login');
const password = document.getElementById('password');
const mail = document.getElementById('mail');
const form =  document.getElementById('form');
const confirmPass = document.getElementById('confirmPass');
const msg = document.getElementById('msg');

class InputForm {
    constructor (login, pass, mail) {
        this.password = pass;
        this.login = login;
        this.mail = mail;
    }
}

function standartInputPassStyle() {
    password.style.border = 'none';
    confirmPass.style.border = 'none';
    msg.innerHTML = '*requaired fields';
}

function verify(event) {
    event.preventDefault();
    if(password.value !== confirmPass.value) {
        password.style.border = '5px solid red';
        confirmPass.style.border = '5px solid red';
        msg.innerHTML = 'check confirm password';
        return;
    } else {
        standartInputPassStyle();
        fetch('http://localhost:4000/register', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(new InputForm(login.value, password.value, mail.value))
        })
            .then(res => res.text())
            .then(function (text) {
                if (text === 'users allready add') {
                    msg.innerHTML = 'users already added!!!';
                } else {
                    msg.innerHTML = '*requaired fields';
                    window.location.replace("http://localhost:4000/index.html");
                }
            })
            .catch(alert);
    }
}






