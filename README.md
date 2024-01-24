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

| --- | --- | --- |
| `GET` | `api/lists` | Listet alle *lists* |
| `GET` | `api/lists/:id` | Hole eine spezifische *liste* |
| `POST` | `api/lists` | Erstelle eine neue *liste* |
| `PUT` | `api/lists/:id` | Editiere den Namen einer existierenden *liste* oder ordne Ihre *todos* neu |
| `DELETE` | `api/lists/:id` | Lösche eine existierende *liste* und die dazugehörigen *todos* |

| --- | --- | --- |
| `GET` | `api/todos` | Listet alle *todos* |
| `POST` | `api/todos` | Erstelle ein neues *todo* |
| `GET` | `api/todos/:id` | Hole ein spezifisches *todo* |
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```




### List Ressourcen
  - [GET api/lists](#get-apilists)
  - [GET api/lists/:id](#get-apilistsid)
  - [POST api/lists](#post-apilists)
  - [PUT api/lists/:id](#put-apilists:id)
  - [DELETE api/lists/:id](#delete-apilists)

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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```