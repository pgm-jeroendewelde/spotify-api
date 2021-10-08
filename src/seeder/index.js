/* Imports */
import faker from 'faker';
import _  from 'underscore';
// Fix for UUID import, this adds suport for CommonJS require
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/* Models */
import Songs from  '../lib/SongsDb.js';
import Playlists from '../lib/PlaylistsDb.js';
import Users from '../lib/UsersDb.js';
import { fetchPlaylists, fetchSongsFromPlaylist } from './spotify/SpotifyAPI.js';
import  HashPassword  from '../services/hashPassword.js';


/* Variables */
const { v4: uuidv4 } = require('uuid');
const UsersDb = new Users();
const SongsDb = new Songs();
const PlaylistsDb = new Playlists();
let allSongs = [];
import { songsBackup } from './backupSongs/playlistData.js';



/**
 * Create a specified amount of users with fake data, userType is randomized 
 * @param { Number } amount 
 * @returns Array of created Users
 */
const createUsers = (amount) => {
  const users = [];
  const userTypes = ['member', 'admin'];
  for(let i=0; i < amount; i++) {
    const now = Date.now();
    const password = faker.internet.password();
    const randomUser = {
      id: uuidv4(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: HashPassword(password),
      originalPassword: password,
      type: _.sample(userTypes),
      dateAdded: now,
      dateAdjusted: now
    }
    users.push(randomUser);
  }

  return users;
}
/**
 * Create Playlists from Spotify Fetch, 
 * Random users are used to add random userID
 * Add Stringified Songs as property and call 'createSongs', from i elemnt in Array of Locally saved responses
 * @param { Array } users 
 * @returns Array of playlists
 */
const createPlaylists = async (users) => {
  const playlists = [];
  const day = 86400000; 
  const { items } = await fetchPlaylists();
  
  items.forEach((item, i) => {
    const now = Date.now();
    const playlist = {
      id: uuidv4(),
      title: item.name,
      dateAdded: now - Math.floor(Math.random()*30)*day,       
      dateAdjusted: now,
      ownerID: _.sample(users).id,
      songsURI: item.tracks.href,
      songs : createSongs(songsBackup[i])
    }
    playlists.push(playlist);
  });

  return playlists;
}

/**
 * Create Songs from Spotify Response
 * EXTRA NOTE for teachers:
 * This originally called the 'SpotifyAPI.js' as well, but request IN request failed, Array of SongsResponses is copied
 * from Postman to mimic the same if THIS fetch would've worked, please give feedback about this if possible
 * @param { Array of SongsResponses } songsList 
 * @returns Array of Ids (stringified)
 */
const createSongs = (songsList) => {
  const songs = [];
  const {items } = songsList;
  items.forEach(item => {
    const now = Date.now();
    const song = {
      id: uuidv4(),
      title: item.track.name,
      artist: item.track.artists[0].name,
      URI: item.track.uri,
      dateAdded: now,
      dateAdjusted : now
    };
    songs.push(song);
  });

  // add all songs to global variable
  allSongs = [...allSongs, ...songs];

  // map all IDs from the songs and stringify, to be added later to the Database
  const Ids = songs.map(song => song.id);
  const IdArray = JSON.stringify(Ids);
  return IdArray;
}

/**
 * Seed all random users to the database
 * @param { Array } users 
 * @returns 
 */
const seedUsers = (users) => {
  const ids = users.map( async(user) => await UsersDb.add(user));
  return Promise.all(ids); 
}

/**
 * Seed all playlists to the database
 * @param { Array } playlists 
 * @returns 
 */
const seedPlaylists = (playlists) => {
  const ids = playlists.map( async(playlist) => await PlaylistsDb.add(playlist));
  return Promise.all(ids); 
}

/**
 * Seed all songs to the database
 * @param { Array } songs 
 * @returns 
 */
const seedSongs = (songs) => {
  const ids = songs.map( async(song) =>  await SongsDb.add(song));
  return Promise.all(ids); 
}

/**
 * Clear all tables from database,
 * Create Users & Seed. Create playlists (and songs) and seed
 */
const seed = async () => {
  await UsersDb.clearTable();
  await PlaylistsDb.clearTable();
  await SongsDb.clearTable();

  const users = createUsers(5);
  const userIds = await seedUsers(users);
  console.log(`${userIds.length} users are added to the database`);

  const playlists = await createPlaylists(users);
  const playlistsIds = await seedPlaylists(playlists);
  console.log(`${playlistsIds.length} playlists were added to the database`);

  // Seed all songs saved in global variable, already created/called for in 'createPlaylists()'
  const songsIds = await seedSongs(allSongs);
  console.log(`${songsIds.length} songs were added to the database`);
  
  process.exit();
}
seed();