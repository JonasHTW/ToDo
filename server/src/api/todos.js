const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {

    res.json({
        message: "GET ALL",
    });

});


router.get('/:id', async (req, res) => {
    const todoId = req.params.id;

    res.json({
        message: `GET todo by id, id: ${todoId}`,
    });

});


router.post('/', (req, res) => {
    
    res.json({
        message: "POST a new todo",
    });

});

router.post('/:id', (req, res) => {
    
    res.json({
        message: "PUT existing todo",
    });

});

module.exports = router;