const express = require('express');
const router = express.Router();

const todos = require('./todos')

router.get('/', (req, res) => {
   // const listName = req.params.listname;
    res.json({
        message: 'Willkommen zu den listen'
    });
});

router.get('/:listId', async (req, res) => { 
    const listId = req.params.listId;
    res.json({
        message: `GET ${listId}`, 
    });
});

router.use('/todos', todos);

module.exports = router;