import { v4 as uuidv4 } from 'uuid';
import knexMusic from '../../db/knexMusic.js';

export default class PlaylistsDb {
  constructor() {
    this.table = "playlists";
  }

  /**
   * Get array of Playlists OR Playlist with given ID
   * 
   * @param { null|String } id 
   * @returns Array OR Object
   */
   async get(id = null) {
    try {
      if(!id) {
        return await knexMusic(this.table).select('*');
      }
      const [playlist] = await knexMusic(this.table).where("id", id);
      return playlist
    } catch ({ message }) {
        console.log(message);
    }
  }

  /**
   * Get array of Playlists OR Playlist with given ownerId
   * 
   * @param { null|String } id 
   * @returns Array OR Object
   */
   async getByOwner(id = null) {
    try {
      if(!id) {
        return await knexMusic(this.table).select('*');
      }
      const [playlist] = await knexMusic(this.table).where("ownerID", id);
      return playlist
    } catch ({ message }) {
        console.log(message);
    }
  }

  /**
   * Add Playlist with given Object
   * {id, title, dateAdded, dateAdjusted, owner, songs}
   * 
   * @param { Object } field 
   * @returns ID of added playlist
   */
  async add(field) {
    try {
      const newPlaylist = {
        id: uuidv4(),
        title: field.title,
        dateAdded: Date.now(),
        dateAdjusted: Date.now(),
        ownerID: field.ownerID,
        songs: field.songs,
        songsURI: field.songsURI
      }
      return await knexMusic(this.table).insert(newPlaylist)
    } catch ({ message }) {
      console.error(message);
    }
  }

  /**
   * Update an existing playlist with given Object
   * {id, title, dateAdded, dateAdjusted, owner, songs}
   * 
   * @param { Object } field 
   * @returns 
   */
  async update(field) {
    try {
      let updatedPlaylist = {
        title: field.title,
        songsURI: field.songsURI
      }

      // if there are songs given in the body of the request, add them
      if(field.songs) {
        const [currentPlaylist] = await knexMusic(this.table).where("id", field.id);
        let arrayOfSongs = [];
        const newSongs = field.songs;
        
        // if there are already songs in the db, add these first, THEN add the songs from the body
        if(currentPlaylist.songs.length === 0) {
          arrayOfSongs = JSON.parse(field.songs);
        } else {
          arrayOfSongs = [...JSON.parse(currentPlaylist.songs) ,...JSON.parse(newSongs)];
          console.log(arrayOfSongs);
        }

        // stringify array of songs and add as property for updatedPlaylist
        updatedPlaylist.songs = JSON.stringify(arrayOfSongs);
      }

      return await knexMusic(this.table).where('id', field.id).update(updatedPlaylist);

    } catch ({ message }) {
      console.log(message);
    }
  }

  /**
   * Deletes a specific playlist
   * 
   * @param { String } id 
   * @returns 
   */
  async delete(id) {
    try {
      return await knexMusic(this.table).where('id', id).del();
    } catch ({ message }) {
      console.log(message);
    }
  }

  /**
   * Deletes all records from table
   * @returns Amount of records erased
   */
  async clearTable() {
    try {
      return await knexMusic(this.table).select('*').del();
    } catch ({message}) {
      console.log(message);
    }
  }
}