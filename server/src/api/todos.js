const express = require('express');
const router = express.Router();
const Todo = require("../dbmodels/todo");
const List = require("../dbmodels/list");
const authenticateToken = require('../middleware/authenticateToken');

// Erhalte alle Todos
router.get('/', authenticateToken, (req, res) => {

    console.log((new Date()).toISOString(), req.method);

    Todo.find({ user: req.userId })
        .then(todos => {
            res.status(200).json({ 'status': 'Success', 'todo': todos });
        })
        .catch(error => {
            res.status(500).json({ 'status': 'Error', 'error': error.message });
        });

});

// Erhalte eine Todo anhand der id
router.get('/:id', authenticateToken, (req, res) => {

    console.log((new Date()).toISOString(), req.method);

    Todo.findOne({ user: req.userId, _id: req.params.id })
        .then(Todo => {
            if (!Todo) {
                return res.status((404)).json({ 'status': 'Success', 'message': 'No Todo found with todoId' });
            }
            res.status(200).json({ 'status': 'Success', 'Todo': Todo });
        })
        .catch(error => {
            res.status(500).json({ 'status': 'Error', 'error': error });
        });

});


// Füge eine neue Todo hinzu
router.post('/', authenticateToken, async (req, res) => {

    console.log((new Date()).toISOString(), req.method);

    try {
        let list;
        // Überprüfen, ob die Liste mit der gegebenen ID existiert
        if (req.body.list) {
            list = await List.findOne({ _id: req.body.list, user: req.userId });
            if (!list) {
                return res.status(404).json({ 'status': 'Error', 'message': 'No list found with the given ID' });
            }
        }

        // Liste gefunden oder keine List-ID angegeben, Todo erstellen
        const createdTodo = new Todo({ ...req.body, user: req.userId });

        const savedTodo = await createdTodo.save();

        if (list) {
            // Wenn eine Liste vorhanden ist, füge die Todo-ID zur Liste hinzu
            await List.updateOne({ _id: req.body.list }, { $addToSet: { todos: savedTodo._id } });
        }

        res.status(201).json({ 'status': 'Success', 'Todo': savedTodo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'status': 'Error', 'error': error.message });
    }

});

// Aktualisiere eine Todo anhand der id
router.put('/:id', authenticateToken, async (req, res) => {

    console.log((new Date()).toISOString(), req.method);

    const todoId = req.params.id;

    // Verbiete das Verändern der _id sowie des users
    const { _id, user, ...updateData } = req.body;

    try {
        if (updateData.list) {
            // Überprüfe, ob die Liste mit der übergebenen ID existiert
            const newList = await List.findOne({ _id: updateData.list, user: req.userId });

            if (!newList) {
                return res.status(404).json({ 'status': 'Error', 'message': 'List not found' });
            }

            // Entferne die Todo-Referenz direkt aus dem Array
            await List.updateMany(
                { todos: todoId },
                { $pull: { todos: todoId } }
            );

            // Füge die Todo-Referenz zur neuen Liste hinzu
            await List.updateOne({ _id: updateData.list }, { $addToSet: { todos: todoId } });
        }

        // Aktualisiere die Todo
        const updatedTodo = await Todo.findOneAndUpdate({ _id: todoId, user: req.userId }, updateData, { new: true });

        res.status(200).json({ 'status': 'Success', 'todo': updatedTodo });
    } catch (error) {
        res.status(500).json({ 'status': 'Error', 'error': error.message });
    }
});

// Markiere eine todo als complete anhand der id
router.patch('/:id', authenticateToken, (req, res) => {

    console.log((new Date()).toISOString(), req.method);

    const todoId = req.params.id;

    Todo.findOneAndUpdate({ _id: todoId, user: req.userId }, { completed: true }, { new: true })
        .then(updatedTodo => {
            res.status(200).json({ 'status': 'Success', 'Todo': updatedTodo });
        })
        .catch(
            error => {
                res.status(500).json({ 'status': 'Error', 'error': error });
            })

});

// Lösche eine Todo anhand der id
router.delete('/:id', async (req, res) => {

    const todoId = req.params.id;
    console.log((new Date()).toISOString(), req.method);

    Todo.findById({ user: req.userId, _id: todoId })
        .then(deletedTodo => {
            if (!deletedTodo) {
                return res.status(404).json({ 'status': 'Error', 'message': 'Todo not found' });
            }

            // Finde alle Listen, in denen sich die Todo befindet
            return List.find({ todos: todoId });
        })
        .then(listsToUpdate => {
            // Aktualisiere jede Liste, entferne die Todo-Referenz
            const listUpdatePromises = listsToUpdate.map(list => {
                list.todos = list.todos.filter(todoRef => todoRef.toString() !== todoId);
                return list.save();
            });

            return Promise.all(listUpdatePromises);
        })
        .then(() => {
            // Lösche die Todo
            return Todo.findByIdAndDelete(todoId);
        })
        .then(() => {
            res.status(200).json({ 'status': 'Success', 'message': 'Todo deleted' });
        })
        .catch(error => {
            res.status(500).json({ 'status': 'Error', 'error': error });
        });
});

module.exports = router;