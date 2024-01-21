const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const loginRoute = require("./api/login");
const addRoute = require("./api/add");
const { JwtAuth } = require("./jwt/JwtAuth");
// const api = require('./api');

require('dotenv').config();
console.log(process.env);

const app = express();
const port = 81;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// app.get('/', (req, res) => {
//    res.json({
//        message: "Willkommen"
//    });
//});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/register.html"));
});


app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/welcome.html"));
});


app.post('/login', loginRoute);
app.post('/add', JwtAuth, addRoute);


// app.use('/api', api);

// app.post("auth/login", loginRoute);


app.listen(port, () => {
    console.log(`listening to http://localhost:${port}`)
});