# ToDo

## Index
* [Voraussetzungen] (#voraussetzungen)
* [Installation] (#installation)
* [Schema] (#schema)
* [Authentifizierung] (#authentifizierung)
* [Endpunkte] (#endpunkte)


## Voraussetzungen

- [node & npm](http://nodejs.org)
- [MongoDB](https://www.mongodb.com/): Es muss lokal eine Instanz auf dem Port 27017 laufen. (siehe .env 'URL');


## Installation
1. Das Repository klonen `git clone https://github.com/JonasHTW/ToDo.git`
2. In das Verzeichnis `server` wechseln.
3. `npm install` ausführen.
4. Den Server starten: `node src/server.js` (wichtig: Start im Verzeichnis `server` um .env richtig zu laden).


## Schema
### Benutzer (User)
- Jeder Benutzer hat eine eindeutige Benutzer-ID (`_id`).
- Jeder Benutzer ist durch seine E-Mail identifiziert (`email`).
- Ein Benutzer kann mehrere Listen haben.


### Listen (List)
- Jede Liste hat eine eindeutige Listen-ID (_id).
- Jede Liste hat einen Titel (title).
- Eine Liste gehört zu einem bestimmten Benutzer und referenziert die Benutzer-ID (user).
- Jede Liste enthält eine Liste von Todos, die als IDs referenziert werden (todos).

### Aufgaben (Todo)
- Jedes Todo hat eine eindeutige Todo-ID (_id).
- Jedes Todo hat einen Titel (title).
- Ein Todo enthält Informationen darüber, ob es abgeschlossen ist (completed).
- Ein Todo kann zu einer bestimmten Liste gehören und referenziert die Listen-ID (list).
- Die Todos können auch unabhängig ihrer zugehörigen Listen abgefragt werden.


## Authentifizierung
Es können User angelegt (registriert) werden. Dafür werden im Request Body der Anfrage 'email' und 'password' übergeben.
Es kann sich eingeloggt werden. Dafür werden im Request Body der Anfrage 'email' und 'password' übergeben.
Ist die Anmeldung oder Registrierung erfolgreich, wird ein token zurückgegeben welcher im Header der Anfrage 'Authorization'
übergeben werden kann. Für eine Stunde kann dieser token genutzt werden um seine Anfragen zu authentifizieren.
Es werden beim Starten des Servers bereits 2 Nutzer angelegt (benutzer1@example.com, benutzer2@example.com), beide Nutzer können
mit dem Passwort "test" einen validen token erhalten.

## Endpunkte
| Methode | Endpunkt | Beschreibung |
| --- | --- | --- |
| `POST` | `auth/register` | Erstelle einen neuen *benutzer* |
| `POST` | `auth/login` | Melde einen *benutzer* an |

| Methode | Endpunkt | Beschreibung |
| --- | --- | --- |
| `GET` | `api/lists` | Listet alle *lists* |
| `GET` | `api/lists/:id` | Hole eine spezifische *liste* |
| `POST` | `api/lists` | Erstelle eine neue *liste* |
| `PUT` | `api/lists/:id` | Editiere den Namen einer existierenden *liste* oder ordne ihre *todos* neu |
| `DELETE` | `api/lists/:id` | Lösche eine existierende *liste* und die dazugehörigen *todos* |

| Methode | Endpunkt | Beschreibung |
| --- | --- | --- |
| `GET` | `api/todos` | Listet alle *todos* |
| `GET` | `api/todos/:id` | Hole ein spezifisches *todo* |
| `POST` | `api/todos` | Erstelle ein neues *todo* |
| `PUT` | `api/todos/:id` | Editiere ein existierendes *todo* |
| `PATCH` | `api/todos/:id` | Markiere ein *todo* als fertig |
| `DELETE` | `api/todos/:id` | Lösche ein existierendes *todo* |



## Dokumentation
Link muss noch erstellt und eingefügt werden.

## Beispiele
#### Basis URL
`http://localhost:81/`

### User Ressourcen
  - [POST auth/register](#post-authregister)
  - [POST auth/login](#post-authlogin)

### POST /auth/register
Einen *benutzer* erstellen.
#### URL
`http://localhost:81/auth/register`
#### Request Body
```javascript
{
    "email": "benutzer1@example.com",
    "password": "test"
}
```
#### Response
```javascript
{
    "status": "Success",
    "message": "Benutzer erfolgreich registriert" ,
    "token": "TOKEN"
}
```


### POST /auth/login
Einen *benutzer* anmelden.
#### URL
`http://localhost:81/auth/login`
#### Request Body
```javascript
{
    "email": "benutzer1@example.com",
    "password": "test"
}
```
#### Response
```javascript
{
    "status": "Success",
    "message": "Benutzer erfolgreich angemeldet" ,
    "token": "TOKEN"
}
```




### List Ressourcen
  - [GET api/lists](#get-apilists)
  - [GET api/lists/:id](#get-apilistsid)
  - [POST api/lists](#post-apilists)
  - [PUT api/lists/:id](#put-apilistsid)
  - [DELETE api/lists/:id](#delete-apilists)

### GET /api/lists
Listet alle *lists* auf.
#### URL
`http://localhost:81/api/lists`
#### Request Header
```json
{
    "Authorization": "Bearer TOKEN"
}
```
#### Response
```json
{
    "status": "Success",
    "list": [
        {
            "_id": "65b0ed15ee1cb12b2614b381",
            "title": "Studium",
            "todos": [
                "65b0ed15ee1cb12b2614b383",
                "65b0ed15ee1cb12b2614b384"
            ],
            "user": "65b0ed15ee1cb12b2614b37f",
            "__v": 1
        },
        {
            "_id": "65b0ed15ee1cb12b2614b389",
            "title": "Arbeit",
            "todos": [
                "65b0ed15ee1cb12b2614b38b"
            ],
            "user": "65b0ed15ee1cb12b2614b37f",
            "__v": 1
        }
    ]
}
```


### GET /api/lists/:id
Hole eine spezifische *liste*.
#### URL
`http://localhost:81/api/lists/:id`
#### Request Header
```json
{
    "Authorization": "TOKEN"
}
```
#### Response
```json
{
    "status": "Success",
    "list": {
        "_id": "65b0ed15ee1cb12b2614b381",
        "title": "Studium",
        "todos": [
            "65b0ed15ee1cb12b2614b383",
            "65b0ed15ee1cb12b2614b384"
        ],
        "user": "65b0ed15ee1cb12b2614b37f",
        "__v": 1
    }
}
```


### POST /api/lists
Erstelle eine neue *liste*.
#### URL
`http://localhost:81/api/lists`
#### Request Header
```json
{
    "Authorization": "Bearer TOKEN"
}
```
#### Request Body
```json
{
    "title": "NeueListe"
}
```
#### Response
```json
{
    "status": "Success",
    "List": {
        "title": "NeueListe",
        "todos": [],
        "user": "65b0ed15ee1cb12b2614b37f",
        "_id": "65b0eedcee1cb12b2614b392",
        "__v": 0
    }
}
```


### PUT /api/lists/:id
Editiere den Namen einer existierenden *liste* oder ordne ihre *todos* neu.
#### URL
`http://localhost:81/api/lists/:id`
#### Request Parameters
`{{id}}`
#### Request Header
```json
{
    "Authorization": "Bearer TOKEN"
}
```
#### Request Body
```json
{
    "title": "NeuerTitel",
    "todoId": "65b0ed15ee1cb12b2614b384",
    "index": 0
}
```
#### Response
```json
{
    "status": "Success",
    "message": "Todo moved to 0"
}
```


### DELETE /api/lists/:id
Lösche eine existierende *liste* und die dazugehörigen *todos*.
#### URL
`http://localhost:81/api/lists/:id`
#### Request PARAMETS
`{{id}}`
#### Request Header
```json
{
    "Authorization": "Bearer TOKEN"
}
```
#### Response
```json
{
    "status": "Success",
    "message": "List deleted along with associated Todos"
}
```




### Todo Ressourcen
  - [GET api/todos](#get-apitodos)
  - [GET api/lists/:id](#get-apitodosid)
  - [POST api/todos](#post-apitodos)
  - [PUT api/lists/:id](#put-apitodosid)
  - [PATCH api/lists/:id](#patch-apitodosid)
  - [DELETE api/lists/:id](#delete-apitodos)

### GET /api/todos
Listet alle *todos* auf.
#### URL
`http://localhost:81/api/todos`
#### Request Header
```json
{
    "Authorization": "Bearer TOKEN"
}
```
#### Response
```json
{
    "status": "Success",
    "todo": [
        {
            "_id": "65b0ed15ee1cb12b2614b379",
            "title": "Einkaufen",
            "completed": false,
            "list": "65b0ed15ee1cb12b2614b377",
            "user": "65b0ed15ee1cb12b2614b375",
            "__v": 0
        },
        {
            "_id": "65b0ed15ee1cb12b2614b37a",
            "title": "Wäsche machen",
            "completed": false,
            "list": "65b0ed15ee1cb12b2614b377",
            "user": "65b0ed15ee1cb12b2614b375",
            "__v": 0
        }
    ]
}
```


### GET /api/lists/:id
Hole eine spezifische *todo*.
#### URL
`http://localhost:81/api/todos/:id`
#### Request Parameters
`{{id}}`
#### Request Header
```json
{
    "Authorization": "TOKEN"
}
```
#### Response
```json
{
    "status": "Success",
    "todo": [
        {
            "_id": "65b0ed15ee1cb12b2614b379",
            "title": "Einkaufen",
            "completed": false,
            "list": "65b0ed15ee1cb12b2614b377",
            "user": "65b0ed15ee1cb12b2614b375",
            "__v": 0
        },
        {
            "_id": "65b0ed15ee1cb12b2614b37a",
            "title": "Wäsche machen",
            "completed": false,
            "list": "65b0ed15ee1cb12b2614b377",
            "user": "65b0ed15ee1cb12b2614b375",
            "__v": 0
        }
    ]
}
```


### POST /api/todos
Erstelle eine neue *todo*.
#### URL
`http://localhost:81/api/todos`
#### Request Header
```json
{
    "Authorization": "Bearer TOKEN"
}
```
#### Request Body
```json
{
    "title": "Testaufgabe beenden",
    "description": "Dokumentation ergänzen",
    "list": "65b0ed15ee1cb12b2614b389"
}
```
#### Response
```json
{
    "status": "Success",
    "Todo": {
        "title": "Testaufgabe beenden",
        "description": "Dokumentation ergänzen",
        "completed": false,
        "list": "65b0ed15ee1cb12b2614b389",
        "user": "65b0ed15ee1cb12b2614b375",
        "_id": "65b0f330ee1cb12b2614b3a0",
        "__v": 0
    }
}
```


### PUT /api/todos/:id
Editiere eine bestehende *todo*.
#### URL
`http://localhost:81/api/todos/:id`
#### Request Parameters
`{{id}}`
#### Request Header
```json
{
    "Authorization": "Bearer TOKEN"
}
```
#### Request Body
```json
{
    "title": "Testaufgabe beenden und abgeben",
    "description": "Dokumentation ergänzen und drüberlesen",
    "list": "65b0f51bee1cb12b2614b3a4"
}
```
#### Response
```json
{
    "status": "Success",
    "todo": {
        "_id": "65b0f330ee1cb12b2614b3a0",
        "title": "Testaufgabe beenden und abgeben",
        "description": "Dokumentation ergänzen und drüberlesen",
        "completed": false,
        "list": "65b0f51bee1cb12b2614b3a4",
        "user": "65b0ed15ee1cb12b2614b375",
        "__v": 0
    }
}
```


### PATCH /api/todos/:id
Markiere ein *todo* als fertig.
#### URL
`http://localhost:81/api/todos/:id`
#### Request Parameters
`{{id}}`
#### Request Header
```json
{
    "Authorization": "Bearer TOKEN"
}
```
#### Response
```json
{
    "status": "Success",
    "todo": {
        "_id": "65b0f330ee1cb12b2614b3a0",
        "title": "Testaufgabe beenden und abgeben",
        "description": "Dokumentation ergänzen und drüberlesen",
        "completed": true,
        "list": "65b0f51bee1cb12b2614b3a4",
        "user": "65b0ed15ee1cb12b2614b375",
        "__v": 0
    }
}
```


### DELETE /api/todos/:id
Lösche ein existierendes *todo* und den dazugehörigen Eintrag in der *liste*.
#### URL
`http://localhost:81/api/todos/:id`
#### Request PARAMETS
`{{id}}`
#### Request Header
```json
{
    "Authorization": "Bearer TOKEN"
}
```
#### Response
```json
{
    "status": "Success",
    "message": "Todo deleted"
}
```