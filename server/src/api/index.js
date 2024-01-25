const express = require('express');
const router = express.Router();
const lists = require('./lists');
const todos = require("./todos");

router.get('/', (req, res) => {
    res.json({
        message: "Willkommen zur API"
    });
});

router.use('/lists', lists);
router.use('/todos', todos);

module.exports = router;