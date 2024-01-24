const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../dbmodels/user");

router.post("/", (req, res) => {

    console.log((new Date()).toISOString(), req.method);

    const { email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Ungültiges E-Mail-Format.' });
    }

    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({ message: 'E-Mail bereits registriert.' });
            }
            return hashedPw = crypto.createHash('sha256').update(req.body.password).digest('hex');
        })
        .then(hashedPw => {
            const newUser = new User({
                email,
                pwHash: hashedPw,
            });
            return newUser.save();
        })
        .then(savedUser => {
            const token = jwt.sign({ userId: savedUser._id }, process.env.MY_SECRET, { expiresIn: "1h" });
            const decodedToken = jwt.verify(token, process.env.MY_SECRET);
            const userId = decodedToken.userId;
            console.log("userId: ", userId);
            res.status(201).json({ status: "Success", message: 'Benutzer erfolgreich registriert.', token: token });
        })
        .catch(error => {
            console.error('Fehler bei der Benutzerregistrierung:', error);
            res.status(500).json({ message: 'Interner Serverfehler bei der Registrierung.' });
        });
});

module.exports = router;