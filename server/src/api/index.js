const express = require('express');
const router = express.Router();

const lists = require('./lists')

router.get('/', (req, res) => {
    res.json({
        message: "Willkommen zur API"
    });
});

router.use('/lists', lists);

module.exports = router;