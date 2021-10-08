/**
 * Registering the Playlists API endpoints
 */

import express from 'express';
import PlaylistsDb from '../../lib/PlaylistsDb.js';
import { addPlaylist, getPlaylists, getPlaylistByOwner, updatePlaylist, deletePlaylist } from './crudPlaylists.js';

const app = express.Router();
const playlistsData = new PlaylistsDb();


// get the playlists
app.get('/', async (req, res) => {
  await getPlaylists(playlistsData, req, res);
})

// get the playlists by owner
app.get('/:id', async (req, res) => {
  await getPlaylistByOwner(playlistsData, req, res);
})

// add a playlist
app.post('/', async (req, res) => {
  await addPlaylist(playlistsData, req, res);
});

// update a playlist
app.put('/:id', async (req, res) => {
  await updatePlaylist(playlistsData, req, res);
});

// delete a playlist
app.delete('/:id', async (req, res) => {
  await deletePlaylist(playlistsData, req, res);
});

export default app;
