const express = require('express');
const router = express.Router();
const List = require("../dbmodels/list");
const Todo = require("../dbmodels/todo");
const todos = require('./todos')
const authenticateToken = require('../middleware/authenticateToken');

// Erhalte alle Listen
router.get('/', authenticateToken, (req, res) => {

    console.log((new Date()).toISOString(), req.method);

    List.find({ user: req.userId })
        .then(lists => {
            res.status(200).json({ 'status': 'Success', 'list': lists });
        })
        .catch(error => {
            res.status(500).json({ 'status': 'Error', 'error': error.message });
        });

});

// Erhalte eine Liste anhand der id
router.get('/:listId', authenticateToken, async (req, res) => {

    console.log((new Date()).toISOString(), req.method);

    const listId = req.params.listId;

    List.findOne({ _id: listId, user: req.userId })
        .then(List => {
            if (!List) {
                return res.status((404)).json({ 'status': 'Success', 'message': 'No List found with listId' });
            }
            res.status(200).json({ 'status': 'Success', 'list': List });
        }
        )
        .catch(
            error => { res.status(500).json({ 'status': 'Error', 'error': error }); }
        )
});

// Erhalte alle todos zu einer Liste
router.get('/:listId/todos', authenticateToken, (req, res) => {

    console.log((new Date()).toISOString(), req.method);

    const listId = req.params.listId;

    List.findOne({ _id: listId, user: req.userId })
        .populate('todos')
        .then(foundList => {
            if (!foundList) {
                return res.status(404).json({ 'status': 'Error', 'message': 'No List found with listId' });
            }
            const todos = foundList.todos;
            res.status(200).json({ 'status': 'Success', 'todos': todos });
        })
        .catch(error => {
            res.status(500).json({ 'status': 'Error', 'error': error.message });
        });
});

// Füge eine neue Liste hinzu
router.post('/', authenticateToken, async (req, res) => {

    console.log((new Date()).toISOString(), req.method);

    const listData = req.body;
    listData.user = req.userId;

    const createdList = new List(listData);

    createdList.save()
        .then(savedList => {
            res.status(201).json({ 'status': 'Success', 'List': savedList });
        })
        .catch(error => {
            res.status(500).json({ 'status': 'Error', 'error': error.message });
        });

});

// Aktualisiere eine Liste anhand der id
router.put('/:listId', async (req, res) => {

    console.log((new Date()).toISOString(), req.method);

    const listId = req.params.listId;
    const todoId = req.body.todoId;
    const index = req.body.index;

    // Verbiete das Verändern von _id, todos und user
    const { _id, todos, user, ...updateData } = req.body;

    if (todoId && index !== undefined) {
        // Verbiete das Verändern von _id, todos und user
        const { _id, todos, user, ...updateData } = req.body;

        // Verändere die Reihenfolge des Arrays (neu anordnen)
        try {
            const list = await List.findOne({ _id: listId });
            if (!list) {
                return res.status(404).json({ 'status': 'Error', 'message': 'List not found' });
            }

            const indexOfTodo = list.todos.indexOf(todoId);
            if (indexOfTodo === -1) {
                return res.status(404).json({ 'status': 'Error', 'message': 'todoId not valid' });
            }

            if (index >= list.todos.length || index < 0 || typeof index !== 'number' || index === indexOfTodo) {
                return res.status(404).json({ 'status': 'Error', 'message': 'Given index or Id not valid' });
            }

            const it = list.todos[index];
            list.todos[index] = list.todos[indexOfTodo];
            list.todos[indexOfTodo] = it;

            await list.save();

            return res.status(200).json({ 'status': 'Success', 'message': `Todo moved to ${index}` });
        } catch (error) {
            return res.status(500).json({ 'status': 'Error', 'error': error.message });
        }
    }

    // Überprüfe, ob "title" im req.body vorhanden ist
    if ('title' in req.body) {
        try {
            const updatedList = await List.findOneAndUpdate(
                { _id: listId },
                { $set: { title: req.body.title } },
                { new: true }
            );

            if (!updatedList) {
                return res.status(404).json({ 'status': 'Error', 'message': 'List not found' });
            }

            return res.status(200).json({ 'status': 'Success', 'message': 'List title updated' });
        } catch (error) {
            return res.status(500).json({ 'status': 'Error', 'error': error.message });
        }
    }

    // Wenn weder "title" noch ("todoId" und "index") im req.body vorhanden sind
    return res.status(400).json({ 'status': 'Error', 'message': 'Invalid request body' });

});

// Lösche eine Liste anhand der id
router.delete('/:listId', async (req, res) => {

    console.log((new Date()).toISOString(), req.method);

    const listId = req.params.listId;

    try {
        const listId = req.params.listId;

        const deletedList = await List.findByIdAndDelete(listId);

        if (!deletedList) {
            return res.status(404).json({ 'status': 'Error', 'message': 'List not found' });
        }

        // Finde und lösche alle Todos, die zur gelöschten Liste gehören
        await Todo.deleteMany({ list: listId });

        res.status(200).json({ 'status': 'Success', 'message': 'List deleted along with associated Todos' });
    } catch (error) {
        res.status(500).json({ 'status': 'Error', 'error': error.message });
    }
});

router.use('/todos', todos);

module.exports = router;