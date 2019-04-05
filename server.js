const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
let checkUserFlag = false;
let arrAuthUserLogPas = [];
let currentResponse;
let currentID;
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

app.get('/currentUser', (req, res) => {
    res.send(JSON.stringify(arrAuthUserLogPas));
});

app.get('/currentData', (req, res) => {
    getUserDataBase(res);
});

app.get('/clearCurName', (req, res) => {
    arrAuthUserLogPas = [];
});

app.post('/deleteRow', (req, res) => {
    deleteRowPerson(req);
    res.end();
});

app.post('/updateRow', (req, res) => {
    updateRowPerson(req);
    res.end();
});

app.post('/login', function (req, res) {
    createTableLogin();
    checkUserInDataBase(req);
    getIdUser(req);
    setTimeout(responseSend, 500);
    function responseSend() {
        if (checkUserFlag) {
            arrAuthUserLogPas.push(req.body.login);
            arrAuthUserLogPas.push(req.body.password);
            res.send('OK');
        } else {
            res.send('User not defined, press Registration!');
        }
    }
  });

app.post('/register', function (req, res) {
    checkUserInDataBase(req);
    if(checkUserFlag===false) {
        createTablePerson();
        saveDataPersonInLoginTable(req);
        setTimeout(responseSend, 500);
    } else {
        res.send('users allready add');
    }
    function responseSend() {
            arrAuthUserLogPas = [];
            getIdUser(req);
            arrAuthUserLogPas.push(req.body.login);
            arrAuthUserLogPas.push(req.body.password);
            res.send('OK');
    }
});

app.post('/createData', function (req, res) {
        if(currentID) {
            saveDataPersonInPersonTable(req);
            res.send('OK');
        }
});

app.use(express.static('public'));

app.listen(4000, () => {
    console.log('listening port...4000');
});

function  saveDataPersonInLoginTable(req) {
    const connectionDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "person"
    });

    connectionDB.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        const sql = `INSERT INTO tblogin (login, password, mail) VALUES ("${req.body.login}", "${req.body.password}", "${req.body.mail}")`;
        connectionDB.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Saved data login");
        });
    });
}

function  saveDataPersonInPersonTable(req) {
    const connectionDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "person"
    });

    connectionDB.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        const sql = `INSERT INTO tbperson (personID, firstName, lastName, age, loginID) VALUES ("${req.body.id}", "${req.body.firstName}", "${req.body.lastName}", "${req.body.age}", "${currentID[0].id}")`;
        connectionDB.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Saved data person");
        });
    });
}

function createTableLogin() {
    const connectionDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "person"
    });

    connectionDB.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        const sql = "CREATE TABLE IF NOT EXISTS tblogin (\n" +
            "        id INT AUTO_INCREMENT PRIMARY KEY,\n" +
            "        login varchar(100) NOT NULL,\n" +
            "        password varchar(100) NOT NULL,\n" +
            "        mail varchar(100) NOT NULL\n" +
            ")";
        connectionDB.query(sql, function (err, result) {
            if (err) throw err;
            console.log("TableLogin created");
        });
    });
}

function createTablePerson() {
    const connectionDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "person"
    });

    connectionDB.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        const sql = "CREATE TABLE IF NOT EXISTS tbPerson (\n" +
            "        count INT AUTO_INCREMENT PRIMARY KEY NOT NULL,\n" +
            "        personID int NOT NULL,\n" +
            "        firstName varchar(100),\n" +
            "        lastName varchar(100),\n" +
            "        age varchar(100),\n" +
            "        loginID INT NOT NULL,\n" +
            "        FOREIGN KEY (loginID)\n" +
            "        REFERENCES tblogin(id)\n" +
            "        ON DELETE CASCADE " +
            ")";
        connectionDB.query(sql, function (err, result) {
            if (err) throw err;
            console.log("TablePerson created");
        });
    });
}

function checkUserInDataBase (req) {
    const request = req;
    const connectionDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "person"
    });
    connectionDB.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        connectionDB.query("SELECT * FROM tbLogin", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            console.log(request.body.login);
            console.log(request.body.password);
            for(let i in result) {
                console.log(result[i].password);
                console.log(result[i].login);
                if(result[i].login === request.body.login) {
                    checkUserFlag = true;
                    break;
                } else {
                    checkUserFlag = false;
                }
            }
        });
    });
}

function getUserDataBase (res) {
    const connectionDBUpdate = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "person"
    });
    connectionDBUpdate.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        connectionDBUpdate.query(`SELECT tbperson.personID, tbperson.firstName, tbperson.lastName, tbperson.age FROM tbperson WHERE tbperson.loginID = ${currentID[0].id}`, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            res.send(JSON.stringify(result));
        });
    });
}

function updateRowPerson(req) {
    const connectionDB3 = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "person"
    });
    connectionDB3.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        connectionDB3.query(`UPDATE tbperson SET firstName = "${req.body.firstName}" WHERE personID = "${req.body.id}" AND loginID = "${currentID[0].id}"`, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    });

    const connectionDB4 = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "person"
    });
    connectionDB4.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        connectionDB4.query(`UPDATE tbperson SET lastName = "${req.body.lastName}" WHERE personID = "${req.body.id}" AND loginID = "${currentID[0].id}"`, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    });

    const connectionDB5 = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "person"
    });
    connectionDB5.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        connectionDB5.query(`UPDATE tbperson SET age = "${req.body.age}" WHERE personID = "${req.body.id}" AND loginID = "${currentID[0].id}"`, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    });
}

function deleteRowPerson(req) {
    const connectionDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "person"
    });
    connectionDB.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        connectionDB.query(`DELETE FROM tbperson WHERE personID = "${req.body.id}" AND loginID = "${currentID[0].id}"`, function (err, result, fields) {
            if (err) throw err;
            currentResponse = result;
            console.log(result);
        });
    });
}

function getIdUser(req) {
    const connectionIDDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "person"
    });
    connectionIDDB.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        connectionIDDB.query(`SELECT id FROM tblogin WHERE login = "${req.body.login}"`, function (err, result, fields) {
            if (err) throw err;
            currentID = result;
            console.log(result);
        });
    });
}




