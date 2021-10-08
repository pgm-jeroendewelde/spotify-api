/**
 * Registering the Songs API endpoints
 */

import express from 'express';
import SongsDb from '../../lib/SongsDb.js';
import { addSong, getSongs, updateSong, deleteSong } from './crudSongs.js';

const app = express.Router();
const songsData = new SongsDb();


// get the songs
app.get('/', async (req, res) => {
  await getSongs(songsData, req, res);
})

// add a song
app.post('/', async (req, res) => {
  await addSong(songsData, req, res);
});

// update a song
app.put('/:id', async (req, res) => {
  await updateSong(songsData, req, res);
});

// delete a song
app.delete('/:id', async (req, res) => {
  await deleteSong(songsData, req, res);
});

export default app;
