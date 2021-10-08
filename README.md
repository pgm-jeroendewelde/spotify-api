# Opdracht 2: A Spotify API

## Installation
Start project with
> npm install


## Seeder
Seeder is located in ./src/seeder/index.js

### Users
Users are randomly generated with fakerJS

### Playlists
Playlists are fetched with Spotify Data, located in ./src/seeder/spotify/SpotifyAPI.js.
CLIENT_ID and CLIENT_SECRET is not stored in .env, and is real (Jeroen), can be modified
SPOTIFY_USER_ID is a real id (Jeroen).
Token is requested and used to fetch Playlist-data. 
Playlists are then called in the seeder, users are added as parameter to choose random users with "underscore".

### Songs
Songs were also trying to be requested from SPotify API, however there were difficulties, those 8 requests were saved in variables and called in the seeder.

### Seed database
If database is empty run command:
> npm run seed

## Run project
Project is run on port '6006', set in .env, run with following command:
> npm run dev


## EndPoints
There are 4 types of endpoints. for **playlists**, **songs**, **users** and **auth**.

### Endpoint '/playlists'
Possible endpoints
* localhost:6006/playlists | GET
    this fetches ALL the playlists
* localhost:6006/playlists/:id | GET 
    this fetches ALL the playlists from a specific owner, to be find in users-table, id
* localhost:6006/playlists | POST
    you can post a playlist with the following structure:
    ```js{
     "playlist": {
      "title": "the title of the song",
      "ownerID": "the id of the owner-user",
      "songs": "Array of song-ids",
      "songsURI": "Spotify URI for all songs if it is a real Spotify-playlist",
      !!! when updating playlist add:
      "update": true,
     }```
* localhost:6006/playlists/id | PUT
    You can update a playlist with this structure:
    Attention, add "update": true at the end
    ```js{
     "playlist": {
      "title": "the title of the song",
      "ownerID": "the id of the owner-user",
      "songs": "Array of song-ids",
      "songsURI": "Spotify URI for all songs if it is a real Spotify-playlist",
      "update": true,
     }```
* localhost:6006/playlists/:id | DELETE
    this deletes a specific playlist

### Endpoint '/songs'
Possible endpoints
* localhost:6006/songs | GET
    this fetches ALL the playlists
* localhost:6006/songs | POST
    you can post a song with the following structure:
    ```js{
     "song": {
      "title": "the title of the song",
      "artist": "the artist of the song",
      "URI": "the Spotify-URI for this song",
     }
    }```
* localhost:6006/songs/:id | PUT
    You can update a songs with this structure:
    Attention, add "update": true at the end
    ```js{
     "song": {
      "title": "the title of the song",
      "artist": "the artist of the song",
      "URI": "the Spotify-URI for this song",
      "update": true,
     }
    }```
* localhost:6006/songs/:id | DELETE
    this deletes a specific song

### Endpoint '/users'
Possible endpoints
* localhost:6006/users | GET
    this fetches ALL the playlists
* localhost:6006/users | POST
    you can post a song with the following structure:
    ```js{
     "user": {
      "username": "the username",
      "name": "the full nae of the user",
      "email": "the email-adress of the user",
      "password": "the hashed Password of the user",
      "originalPassword": "the Password of the user",
      "type": "admin or member",
      !!! when updating user add:
      "update": true,
     }
    }```
* localhost:6006/users/:id | PUT
    You can update a user with this structure:
    Attention, add "update": true at the end
    ```js{
     "user": {
      "username": "the username",
      "name": "the full nae of the user",
      "email": "the email-adress of the user",
      "password": "the hashed Password of the user",
      "originalPassword": "the Password of the user",
      "type": "admin or member",
      "update": true,
     }
    }```
* localhost:6006/users/:id | DELETE
    this deletes a specific user


### Endpoint '/auth'
Possible endpoints
* localhost:6006/auth/login | POST
    Get a JWT hash in the request if you use following strucure
    ```js
    {
        "username": "username",
        "password": "original password from database"
    }
    ```

## Authorization
There are "Members" and "Admins", defined in users-table.

### Members
Members can edit and modify THEIR playlists and can GET the playlists
Members can NOT edit songs, but can GET the songs
Members can modify user-data, but NOT other users data

### Admin
Admins can edit and modify ALL playlists and GET the playlists
Admins can edit songs, add, remove and GET the songs
Admins can modify ALL user-data, remove and add user

### New Users
A new users can be creates on endpoints "/users" with a POST.

### Authorize
To authorize yourself, add the JWT-token, received from '/auth/login' as a 'bearer-token' in the header.





## Introductie

Iedereen kent wel de populaire muziekspeler: [Spotify](https://www.spotify.com/be-nl/). Wist je dat Spotify ook een API heeft waarmee je (web) applicatie kan connecteren?

Je kan als developer die [Spotify API](https://developer.spotify.com/documentation/web-api/) gebruiken, maar wij doen het voor deze opdracht gewoon helemaal zelf!
In deze opdracht maken jullie een API om liedjes en afspeellijsten te beheren.

Met de API kan je liedjes toevoegen als administrator, elke member kan dan weer afspeellijsten aanmaken en beheren.

## Algemene Specificaties
### Songs
_TIP: -- Elke Spotify lied heeft een eigen unieke URI, deze kan je makkelijk opvragen in de Spotify applicatie:_

IMAGE TOEVOEGEN
---Screenshot 2021-03-22 at 14.02.17.png  ---

Je maakt een API waarmee je liedjes (songs) kan toevoegen aan een database.
Elke Song bevat volgende data:

* Een unieke ID
* Een titel
* Een artiest
* De URI
* De datum + tijdstip wanneer dit liedje werd toegevoegd aan de database
 

### Playlist
Een playlist bestaat uit een aantal songs.
Meerdere playlists kunnen uiteraard dezelfde song bevatten.
Een playlist is aangemaakt door een bepaalde user.

Elke Playlist bevat:

* Een unieke ID
* Een titel
* De eigenaar (relatie met de user die de playlist gemaakt heeft dmv een user_id)
* Een datum en tijdstip waarop de playlist werd aangemaakt
* Een datum en tijdstip waarop de playlist werd aangepast
* Een lijst van de liedjes die bij deze playlist hoort.
 

### Users
Er zijn twee soorten users: een **admin** en een **member**.
Onder het woord beheren begrijpen we **ALLE** CRUD acties.

Een admin:

* kan nieuwe songs creëeren en de songs beheren
* is ook een member, dus kan zijn/haar playlist beheren
Een member:

* kan enkel zijn/haar playlist beheren
    * dus bekijken, maken, bewerken, verwijdere
* kan zich registreren
* kan zijn/haar gegevens wijzigen
    * vb: naam, username, email
 

## Technische specificaties
* Gebruik van [nodemon](https://nodemon.io/)
* Gebruik van [Express.js](https://expressjs.com/)
* ES6 modules (import & export)
* Object Georiënteerde Programming Aanpak (waar mogelijk)
* Database
    * Opslag van data met behulp van een [SQLite3](https://www.npmjs.com/package/sqlite3)
    * DB connectie en SQL-queries naar database via [Knex.js](http://knexjs.org/)
* Users / Auth
    * Registratie van users mogelijk maken
    * Hashing van je wachtwoord dmv [bcrypt](https://www.npmjs.com/package/bcrypt)
    * Authorisatie met [Passport.js](http://www.passportjs.org/)
        * login met username & password
        * geauthenticeerde requests gebeuren met [JWT](https://jwt.io/)-token
* Express middleware
    * cors
    * authenticatie
    * validatie op data (vb is het wel een geldige spotify uri)
    * ...
* Testing
    * met [Jest](https://jestjs.io/)
* Seeding
    * vul de users-tabel met minstens 50 gebruikers door zelf een seeder te programmeren die je via het commando 
* npm run seeder kan uitvoeren. Je mag gebruik maken van de Faker library.
* Git
    * betekenisvolle commits
    * toepassing van git [flow](https://nvie.com/posts/a-successful-git-branching-model/)
* Code Styling
    * gebruik van [ESLint](https://eslint.org/) met de [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)
* Documentatie
    * Je code en functies moeten goed gedocumenteerd zijn
    * Het gebruik van je API moet tevens volledig gedocumenteerd zijn in de README.md file
        * inclusief alle endpoints met de bijhorende HTTP-methodes.

## Toevoegingen door mezelf

.....