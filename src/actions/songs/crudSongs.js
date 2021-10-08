/**
 * All the CRUD endpoint actions together for the Songs
 */

import parseSongs from './parseSongs.js';

/**
 * Getting the Songs
 * 
 * @param {*} songs 
 * @param {*} request 
 * @param {*} response 
 */
export const getSongs = async (songs, request, response) => {
  try {
    response.status(200).json({ songs: await songs.get() });
  } catch ({ message }) {
    response.status(500);
    response.json({ error: message });
  }
}

/**
 * Create a new Song
 * 
 * @param {*} songs 
 * @param {*} request 
 * @param {*} response 
 */
export const addSong = async (songs, request, response) => {
  try {
    const song = parseSongs(request, response);
    const newSong = await songs.add(song);
    response.status(201).json({ songs: newSong });
  } catch ({ message }) {
    response.status(500).json({ error: message });
  }
}

/**
 * Update song with given ID from URL
 * 
 * @param {*} songs 
 * @param {*} request 
 * @param {*} response 
 */
export const updateSong = async (songs, request, response) => {
  try {
    let song = parseSongs(request);
    const { id } = request.params;
    song.id = id;
    const count = await songs.update(song);

    if(count) {
      response.status(200).json({ updated: count });
    } else {
      response.status(404).json({ message: "Record not found" });
    }
  } catch ({ message }) {
    response.status(500).json({ error: message });
  }
}

/**
 * Delete song with given ID from URL
 * 
 * @param {*} songs 
 * @param {*} request 
 * @param {*} response 
 */
export const deleteSong = async (songs, request, response) => {
  try {
    const { id } = request.params;
    await songs.delete(id);
    response.status(204).end();
  } catch ({ message }) {
    response.status(500).json({ error: message });
  }
}