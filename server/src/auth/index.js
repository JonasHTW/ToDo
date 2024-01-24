const express = require('express');
const router = express.Router();

const login = require('./login')
const register = require('./register')

router.get('/', (req, res) => {
    res.json({
        message: "Willkommen zur Authentifizierung"
    });
});

router.use('/register', register);
router.use('/login', login);

module.exports = router;