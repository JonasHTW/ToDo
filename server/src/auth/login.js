const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const router = express.Router();
const User = require("../dbmodels/user");

router.post("/", async (req, res) => {

    console.log((new Date()).toISOString(), req.method);

    const { email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    try {
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: "Error", message: 'Ungültiges E-Mail-Format.' });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ status: "Error", message: 'E-Mail nicht gefunden.' });
        }

        const hashedPw = crypto.createHash('sha256').update(req.body.password).digest('hex');

        if (existingUser.pwHash === hashedPw) {
            const token = jwt.sign({ userId: existingUser._id }, process.env.MY_SECRET, { expiresIn: "1h" });
            return res.status(200).json({ status: "Success", message: 'Benutzer erfolgreich angemeldet', token: token });
        } else {
            return res.status(401).json({ status: "Error", message: 'Kein Zugriff möglich' });
        }
    } catch (error) {
        console.error('Fehler beim Benutzerlogin:', error);
        return res.status(500).json({ status: "Error", message: 'Interner Serverfehler beim Login' });
    }
});

module.exports = router;