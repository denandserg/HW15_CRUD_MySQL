const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
let checkUserFlag = false;
let arrAuthUserLogPas = [];
let currentResponse;
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

app.get('/currentUser', (req, res) => {
    res.send(JSON.stringify(arrAuthUserLogPas));
});

app.get('/currentData', (req, res) => {
    getUserDataBase(res);
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
    createTablePerson();
    checkUserInDataBase(req);
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
    if(checkUserFlag===false) {
        saveDataPersonInLoginTable(req);
        saveDataPersonInPersonTableRegistration(req);
        setTimeout(responseSend, 500);
    } else {
        res.send('users allready add');
    }
    function responseSend() {
            const ob = req.body.mail;
            arrAuthUserLogPas = [];
            arrAuthUserLogPas.push(req.body.login);
            arrAuthUserLogPas.push(req.body.password);
            res.send(ob);
            console.log('register successfully')
    }
});

app.post('/createData', function (req, res) {
        saveDataPersonInLoginTable(req);
        saveDataPersonInPersonTable(req);
        res.end();
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
        const sql = `INSERT INTO tbperson (firstName, lastName, age, mailID) VALUES ("${req.body.firstName}", "${req.body.lastName}", "${req.body.age}", "${req.body.mail}")`;
        connectionDB.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Saved data person");
        });
    });
}

function  saveDataPersonInPersonTableRegistration(req) {
    const connectionDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "person"
    });

    connectionDB.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        const sql = `INSERT INTO tbperson (mailID) VALUES ("${req.body.mail}")`;
        connectionDB.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Saved data personReg");
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
            "        login varchar(100) NOT NULL,\n" +
            "        password varchar(100) NOT NULL,\n" +
            "        mail varchar(100) NOT NULL,\n" +
            "        PRIMARY KEY (`mail`)\n" +
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
            "        personID int NOT NULL auto_increment,\n" +
            "        firstName varchar(100),\n" +
            "        lastName varchar(100),\n" +
            "        age varchar(100),\n" +
            "        mailID varchar(100) NOT NULL,\n" +
            "        PRIMARY KEY (personID),\n" +
            "        FOREIGN KEY (mailID)\n" +
            "        REFERENCES tblogin(mail)\n" +
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
                if(result[i].login === request.body.login && result[i].password === request.body.password) {
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
        connectionDBUpdate.query("SELECT tbperson.personID, tblogin.login, tblogin.password, tblogin.mail, tbperson.firstName, tbperson.lastName, tbperson.age FROM tbperson, tblogin WHERE tbperson.mailID = tblogin.mail", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            res.send(JSON.stringify(result));
        });
    });


}

function updateRowPerson(req) {
    const connectionDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "person"
    });
    connectionDB.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        connectionDB.query(`UPDATE tblogin SET login = "${req.body.login}" WHERE mail = "${req.body.mail}"`, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    });

    const connectionDB2 = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "person"
    });
    connectionDB2.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        connectionDB2.query(`UPDATE tblogin SET password = "${req.body.password}" WHERE mail = "${req.body.mail}"`, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    });

    const connectionDB3 = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "person"
    });
    connectionDB3.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        connectionDB3.query(`UPDATE tbperson SET firstname = "${req.body.firstName}" WHERE mailID = "${req.body.mail}"`, function (err, result, fields) {
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
        connectionDB4.query(`UPDATE tbperson SET lastname = "${req.body.lastName}" WHERE mailID = "${req.body.mail}"`, function (err, result, fields) {
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
        connectionDB5.query(`UPDATE tbperson SET age = "${req.body.age}" WHERE mailID = "${req.body.mail}"`, function (err, result, fields) {
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
        connectionDB.query(`DELETE FROM tblogin WHERE mail = "${req.body.mail}"`, function (err, result, fields) {
            if (err) throw err;
            currentResponse = result;
            console.log(result);
        });
    });
}




