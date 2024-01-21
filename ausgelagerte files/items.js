const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const response = await fetch('https://dummyjson.com/todos');
        
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Daten');
        }

        const data = await response.json();

        const jsonResponse = {
            result: data,
        };

        res.json(jsonResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});


router.get('/:id', async (req, res) => {
    const todoId = req.params.id;

    try {
        const response = await fetch(`https://dummyjson.com/todos/${todoId}`);
        
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Daten');
        }

        const data = await response.json();

        const jsonResponse = {
            result: data,
        };

        res.json(jsonResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});


router.post('/', (req, res) => {
    const { name } = req.body;
    console.log(name);

})

module.exports = router;