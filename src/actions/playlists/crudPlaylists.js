/**
 * All the CRUD endpoint actions together for the Playlists
 */

import parsePlaylists from './parsePlaylists.js';
/**
 * Getting the Playlists
 * 
 * @param {*} playlists 
 * @param {*} request 
 * @param {*} response 
 */
export const getPlaylists = async (playlists, request, response) => {
  try {
    response.status(200).json({ playlists: await playlists.get() });
  } catch ({ message }) {
    response.status(500).response.json({ error: message });
  }
}

/**
 * Getting the Playlist by ownerId
 * 
 * @param {*} playlists 
 * @param {*} request 
 * @param {*} response 
 */
export const getPlaylistByOwner = async (playlists, request, response) => {
  try {
    const ownerId = request.params.id
    response.status(200).json({ playlists: await playlists.getByOwner(ownerId) });
  } catch ({ message }) {
    response.status(500).response.json({ error: message });
  }
}

/**
 * Create a new Playlist
 * 
 * @param {*} playlists 
 * @param {*} request 
 * @param {*} response 
 */
export const addPlaylist = async (playlists, request, response) => {
  try {
    const playlist = parsePlaylists(request, response);
    const newPlaylist = await playlists.add(playlist);
    response.status(201).json({ playlist: newPlaylist });
  } catch ({ message }) {
    response.status(500).json({ error: message });
  }
}

/**
 * Modify parsed Playlist and add ID from URL
 * if count returns 0, playlist with given id does not exist
 * 
 * @param {*} playlists 
 * @param {*} request 
 * @param {*} response 
 */
export const updatePlaylist = async (playlists, request, response) => {
  try {
    let playlist = parsePlaylists(request);
    const { id } = request.params;
    playlist.id = id;

    const count = await playlists.update(playlist);
    if(count) {
      response.status(200).json({ updated: count });
    } else {
      response.status(404).json({ message: "Playlist not found" });
    }
  } catch ({ message }) {
    response.status(500).json({ error: message });
  }
}

/**
 * Delete playlist with ID from URL
 * 
 * @param {*} playlists 
 * @param {*} request 
 * @param {*} response 
 */
export const deletePlaylist = async (playlists, request, response) => {
  try {
    const { id } = request.params;
    await playlists.delete(id);
    response.status(204).end();
  } catch ({ message }) {
    response.status(500).json({ error: message });
  }
}