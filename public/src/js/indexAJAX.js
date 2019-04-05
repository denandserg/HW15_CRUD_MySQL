window.onload = function () {
    form.addEventListener('submit', verify);
    registration.addEventListener('click', () => {window.location.replace("http://localhost:4000/registrationForm.html")});
};
const login = document.getElementById('login');
const password = document.getElementById('password');
const inputResponse = document.getElementById('response');
const registration = document.getElementById('registration');
const form =  document.getElementById('form');

class InputForm {
    constructor(login, pass){
        this.password = pass;
        this.login = login;
    }
}

function verify(event) {
    event.preventDefault();
    fetch('http://localhost:4000/login', {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(new InputForm(login.value, password.value))
    })
        .then(res => res.text())
        .then(function(text) {
            if (text === 'User not defined, press Registration!') {
                inputResponse.value = text;
            } else {
                window.location.replace("http://localhost:4000/index.html");
            }
        })
        .catch( alert );
}






