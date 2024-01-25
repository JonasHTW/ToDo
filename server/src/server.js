const mongoose = require("mongoose");
const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
require('dotenv').config();
const api = require('./api');
const auth = require('./auth');
const cors = require("cors");
const initiateScript = require('./initiate/initiate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Verbindung zu MongoDB herstellen
mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true });

// DB befüllen
const User = require('./dbmodels/user');
User.findOne().then(foundUser => {
  if (!foundUser) {
    initiateScript();
  }
})


app.get('/', (req, res) => {
  res.json({
    message: "Willkommen zur API"
  });
});

app.use('/auth', auth);
app.use('/api', api);
app.use(cors());

app.listen(port, () => {
  console.log(`listening to http://localhost:${port}`)
});

//Dokumentation
const yaml = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = yaml.load(path.resolve(__dirname, '../openapi.yaml'));
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = mongoose;