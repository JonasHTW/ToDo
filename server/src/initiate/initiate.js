const crypto = require("crypto");
const User = require("../dbmodels/user");
const List = require("../dbmodels/list");
const Todo = require("../dbmodels/todo");

module.exports = initiateScript;

async function initiateScript() {

    try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log('IniatiateScript: Initialisere erste Daten');
            const password = crypto.createHash('sha256').update("test").digest('hex');

            // ***** User 1 *****
            let user1Data = new User({
                email: "benutzer1@example.com",
                pwHash: `${password}`,
            });

            let savedUser = await user1Data.save();

            let neueListe = new List({
                title: 'Haushalt',
                tasks: [],
                user: savedUser.id
            });
            let savedList = await neueListe.save();
            console.log(savedList);
            savedUser.lists.push(savedList._id);
            savedUser.save();

            console.log('Benutzer und Liste erfolgreich erstellt:', savedUser, savedList);

            // Aufgaben erstellen und der Liste zuweisen
            let task1 = new Todo({
                title: 'Einkaufen',
                completed: false,
                user: savedUser.id,
                list: savedList._id
            });

            let task2 = new Todo({
                title: 'Wäsche machen',
                completed: false,
                user: savedUser.id,
                list: savedList._id
            });

            let savedTask1 = await task1.save();
            let savedTask2 = await task2.save();

            // Liste aktualisieren
            savedList.todos.push(savedTask1._id, savedTask2._id);
            await savedList.save();

            console.log('Aufgaben erfolgreich erstellt und der Liste zugeordnet:', savedTask2, savedTask2);
            // ***** User 1 *****

            // ***** User 2 *****
            // Liste 1
            user1Data = new User({
                email: "benutzer2@example.com",
                pwHash: `${password}`,
            });

            savedUser = await user1Data.save();

            neueListe = new List({
                title: 'Studium',
                tasks: [],
                user: savedUser.id
            });
            savedList = await neueListe.save();
            console.log(savedList);
            savedUser.lists.push(savedList._id);
            savedUser.save();

            console.log('Benutzer und Liste erfolgreich erstellt:', savedUser, savedList);

            // Aufgaben erstellen und der Liste zuweisen
            task1 = new Todo({
                title: 'Beleg beenden',
                completed: false,
                user: savedUser.id,
                list: savedList._id
            });

            task2 = new Todo({
                title: 'Prüfung lernen',
                description: 'Besonders für Modul x',
                completed: false,
                user: savedUser.id,
                list: savedList._id
            });

            savedTask1 = await task1.save();
            savedTask2 = await task2.save();

            // Liste aktualisieren
            savedList.todos.push(savedTask1._id, savedTask2._id);
            await savedList.save();

            console.log('Benutzer und Liste erfolgreich erstellt:', savedUser, savedList);

            // Liste 2
            newList = new List({
                title: 'Arbeit',
                tasks: [],
                user: savedUser.id
            });
            savedList = await newList.save();
            savedUser.lists.push(savedList._id);
            savedUser.save();

            task1 = new Todo({
                title: 'E-Mails beantworten',
                completed: false,
                user: savedUser.id,
                list: savedList._id
            });

            savedTask1 = await task1.save();

            // Liste aktualisieren
            savedList.todos.push(savedTask1._id);
            await savedList.save();

            console.log('Aufgaben erfolgreich erstellt und der Liste zugeordnet:', savedTask1, savedList);
            // ***** User 2 *****

        }
    }
    catch (error) {
        console.error('Fehler beim Erstellen des Benutzers und der Liste:', error);
    };

};