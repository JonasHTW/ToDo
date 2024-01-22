const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const loginRoute = require("./auth/login");
const addRoute = require("./auth/add");
const { JwtAuth } = require("./jwt/JwtAuth");
const api = require('./api');

require('dotenv').config();
console.log(process.env);

const app = express();
const port = 81;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// **** test db ****
const mongoose = require("mongoose");
const url = 'mongodb://localhost:27017/meineDatenbank';

// Beispiel: Ein einfaches Mongoose-Modell erstellen
const BeispielSchema = new mongoose.Schema({
  name: String,
  alter: Number,
  tasks: Array
});

// Ein Model aus dem Schema erstellen
const BeispielModel = mongoose.model('Beispiel', BeispielSchema);

// Verbindung zu MongoDB herstellen
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Erfolgreich mit der Datenbank verbunden');

    // Hier kannst du deine Mongoose-Modelle und Operationen hinzufügen

    

    // Beispiel-Dokument erstellen und in die Datenbank speichern
    const beispielDokument = new BeispielModel({ name: 'Beispiel', alter: 25 });
    beispielDokument.save()
      .then((doc) => {
        console.log('Dokument erfolgreich gespeichert:', doc);
      })
      .catch((err) => {
        console.error('Fehler beim Speichern des Dokuments:', err);
      });

    // ... Weitere Operationen können hier durchgeführt werden
  })
  .catch((err) => {
    console.error('Verbindungsfehler:', err);
  });


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

app.get('/find', (req, res) => {

  // Alle Dokumente in der Sammlung abfragen
  BeispielModel.find({})
  .then((alleDokumente) => {

    res.json({
      alleDokumente,
    });
  
  })
  .catch((err) => {
    res.json({
      err,
    });
  })
  .finally(() => {
    // Schließe die Verbindung nach der Abfrage
    mongoose.connection.close();
  });

});

app.post('/login', loginRoute);
app.post('/add', JwtAuth, addRoute);


app.use('/api', api);

// app.post("auth/login", loginRoute);


app.listen(port, () => {
    console.log(`listening to http://localhost:${port}`)
});