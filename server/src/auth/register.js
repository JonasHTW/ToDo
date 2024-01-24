const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../dbmodels/user");
const userPermissions = [];

router.post("/", async (req, res) => {

    console.log((new Date()).toISOString(), req.method);

    const { email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    try {
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Ungültiges E-Mail-Format.' });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ status: "Error", message: 'E-Mail bereits registriert.' });
        }

        const hashedPw = crypto.createHash('sha256').update(req.body.password).digest('hex');

        const newUser = new User({
            email,
            pwHash: hashedPw,
        });

        const savedUser = await newUser.save();

        const token = jwt.sign({ userId: savedUser._id, permissions: userPermissions }, process.env.MY_SECRET, { expiresIn: "1h" });
        const decodedToken = jwt.verify(token, process.env.MY_SECRET);
        const userId = decodedToken.userId;
        console.log("userId: ", userId);

        return res.status(201).json({ status: "Success", message: 'Benutzer erfolgreich registriert.', token: token });
    } catch (error) {
        console.error('Fehler bei der Benutzerregistrierung:', error);
        return res.status(500).json({ message: 'Interner Serverfehler bei der Registrierung.' });
    }
});

module.exports = router;