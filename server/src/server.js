const mongoose = require("mongoose");
const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
require('dotenv').config();
const api = require('./api');
const auth = require('./auth');
const cors = require("cors");
const initiateScript = require('./initiate/initiate');

// modelle
const User = require("./dbmodels/user");
const List = require("./dbmodels/list");
const Todo = require("./dbmodels/todo");

const app = express();
const port = 81;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


// Verbindung zu MongoDB herstellen
mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true });

// DB befüllen
initiateScript();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});


app.get('/welcome', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/welcome.html"));
});

app.get('/find', async (req, res) => {

  // Alle Dokumente in der Benutzer-Sammlung abfragen
  const alleBenutzer = await User.find({});

  res.json({
    alleBenutzer,
  });

});

//app.post('/login', loginRoute);
//app.post('/add', JwtAuth, addRoute);

app.use('/auth', auth);
app.use('/api', api);
app.use(cors());

// app.post("auth/login", loginRoute);


app.listen(port, () => {
  console.log(`listening to http://localhost:${port}`)
});

module.exports = mongoose;